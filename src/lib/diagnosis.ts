import questions from "../data/questions.json";
import logic from "../data/diagnosis_logic.json";
import {
    EnvType,
    ConflictTag,
    AxisKey,
    ENV_TITLES,
    ENV_PROFILE,
    SCHOOL_INDICATOR,
    CRAM_SCHOOL_INDICATOR,
    AXES
} from "../data/result_templates";

export type AnswerMap = Record<string, number>; // id -> 1..5

export type DiagnosisResult = {
    envType: EnvType;
    envLabel: string;
    envContent: {
        lead: string;
        stumble: string; // Detail text
        stumbleSummary: string; // New: Summary text
        conclusion: string;
    };
    conflictTags: { key: ConflictTag; student: string; parent: string; summary: string }[]; // Keeping for type safety, but will be empty
    strategy: {
        title: string;
        firstStep: string;
        summary: string;
    };
    futureAxes: { key: AxisKey; label: string; ideas: string[]; question: string }[];
    evidenceTop3: { key: string; score: number }[];
    indicators: {
        school: { private: number; public: number; texts: typeof SCHOOL_INDICATOR };
        cram: {
            type: 'individual' | 'group' | 'hybrid';
            text: string; // Main description
            label: string; // New: Label (e.g. "Individual (Pace)")
            detail: string; // New: Detail (e.g. "Own pace...")
            warning: string;
            individual: number;
            group: number
        };
        parenting: { doList: string[]; avoidList: string[]; summary: string };
    };
};

function clamp01(n: number) {
    return Math.max(0, Math.min(1, n));
}

function scoreOfAnswer(answer: number, reverse: boolean) {
    // answer 1..5
    return reverse ? 6 - answer : answer;
}

/** C領域は "factor" だけだと細分できないので、設問idからタグキーに分解する */
function cTagKeyFromQid(qid: string): string | null {
    const id = qid.toLowerCase();
    if (id.startsWith("c1-1")) return "AXIS_PEOPLE_HELP";
    if (id.startsWith("c1-2")) return "c1-2-temp"; // Merge logic needed for AXIS_SYSTEM
    if (id.startsWith("c2-1")) return "c2-1-temp"; // Merge logic needed for AXIS_SYSTEM
    if (id.startsWith("c2-2")) return "AXIS_CREATE";
    if (id.startsWith("c4-1")) return "AXIS_DIALOG";
    if (id.startsWith("c5-2")) return "AXIS_UNCERTAIN";
    return null;
}

export function runDiagnosis(answers: AnswerMap): DiagnosisResult {
    // 1) raw集計（factor） + maxScore
    const raw: Record<string, number> = {};
    const max: Record<string, number> = {};

    // Cタグ用（設問別）
    const cRaw: Record<string, number> = {};
    const cMax: Record<string, number> = {};

    for (const q of questions as any[]) {
        const a = answers[q.id];
        if (typeof a !== "number") continue;

        const s = scoreOfAnswer(a, !!q.reverse);

        // 通常のfactor集計
        raw[q.factor] = (raw[q.factor] ?? 0) + s;
        max[q.factor] = (max[q.factor] ?? 0) + 5;

        // Cタグ集計
        const cKey = cTagKeyFromQid(q.id);
        if (cKey) {
            cRaw[cKey] = (cRaw[cKey] ?? 0) + s;
            cMax[cKey] = (cMax[cKey] ?? 0) + 5;
        }
    }

    // 1-5 scale -> 0-1 scale
    const norm = (key: string) => (max[key] ? clamp01((raw[key] ?? 0) / max[key]) : 0);

    // A因子
    const A1 = norm("A1");
    const A2 = norm("A2");
    const A4 = norm("A4");
    const A5 = norm("A5");
    // const A6 = norm("A6"); // Not used in main structure calculation anymore

    // B因子
    const B2 = norm("B2");
    // const B3 = norm("B3");
    const B5 = norm("B5");
    const B6 = norm("B6");
    const B7 = norm("B7");

    // C因子
    const C4 = norm("C4");

    // 環境判定 (A1, A2, A4)
    const privateScore = (A1 + A4) / 2;
    const publicScore = (A2 + (1 - A4)) / 2;
    const diff = privateScore - publicScore;

    let envType: EnvType = "ENV_NEUTRAL";
    if (diff >= logic.thresholds.env_diff) envType = "ENV_PRIVATE";
    else if (-diff >= logic.thresholds.env_diff) envType = "ENV_PUBLIC";

    const profile = ENV_PROFILE[envType];

    // 未来の軸 (Future Axes)
    const cNorm = (key: string) => (cMax[key] ? clamp01((cRaw[key] ?? 0) / cMax[key]) : 0);

    const axisScores: { key: AxisKey; score: number }[] = [
        { key: "AXIS_PEOPLE_HELP", score: cNorm("AXIS_PEOPLE_HELP") },
        { key: "AXIS_SYSTEM", score: (cNorm("c1-2-temp") + cNorm("c2-1-temp")) / 2 },
        { key: "AXIS_CREATE", score: cNorm("AXIS_CREATE") },
        { key: "AXIS_DIALOG", score: cNorm("AXIS_DIALOG") },
    ];

    axisScores.sort((a, b) => b.score - a.score);
    const topAxes = axisScores.slice(0, 2).map(item => ({
        key: item.key,
        ...AXES[item.key]
    }));

    // --- Indicators Logic ---

    // 1) School Fit Score
    const structure = (A1 + A5) / 2;
    const support = A4;
    const autonomy = (A2 + B2) / 2;
    const resilience = B7;
    const focus = B6;

    // Weights
    const privateScoreRaw = 0.45 * structure + 0.35 * support + 0.20 * focus;
    const publicScoreRaw = 0.45 * autonomy + 0.35 * resilience + 0.20 * focus;

    const indSchoolPrivate = clamp01(privateScoreRaw);
    const indSchoolPublic = clamp01(publicScoreRaw);

    const schoolIndicator = {
        private: indSchoolPrivate,
        public: indSchoolPublic,
        texts: SCHOOL_INDICATOR
    };

    // 2) Cram School Fit
    const indIndivScore = 0.50 * A4 + 0.25 * B5 + 0.25 * A1;
    const indGroupScore = 0.45 * C4 + 0.35 * B7 + 0.20 * B6;

    let cramType: 'individual' | 'group' | 'hybrid' = 'hybrid';
    let cramData = CRAM_SCHOOL_INDICATOR.types.hybrid;

    // Logic: 
    // If Individual > Group + 0.1 -> Individual
    // If Group > Individual + 0.1 -> Group
    // Else Hybrid

    if (indIndivScore > indGroupScore + 0.1) {
        cramType = 'individual';
        cramData = CRAM_SCHOOL_INDICATOR.types.individual;
    } else if (indGroupScore > indIndivScore + 0.1) {
        cramType = 'group';
        cramData = CRAM_SCHOOL_INDICATOR.types.group;
    }

    const result: DiagnosisResult = {
        envType,
        envLabel: ENV_TITLES[envType],
        envContent: {
            lead: profile.lead,
            stumble: profile.stumble.detail,
            stumbleSummary: profile.stumble.summary,
            conclusion: profile.conclusion
        },
        conflictTags: [],
        strategy: {
            title: profile.action.title,
            firstStep: profile.action.steps.join(' / '),
            summary: profile.action.summary
        },
        futureAxes: topAxes.map(axis => ({
            key: axis.key,
            label: AXES[axis.key].label,
            ideas: AXES[axis.key].ideas,
            question: AXES[axis.key].question
        })),
        evidenceTop3: [],
        indicators: {
            school: {
                private: schoolIndicator.private,
                public: schoolIndicator.public,
                texts: SCHOOL_INDICATOR
            },
            cram: {
                type: cramType,
                text: cramData.desc,
                label: cramData.label,
                detail: cramData.detail,
                warning: CRAM_SCHOOL_INDICATOR.warning,
                individual: indIndivScore,
                group: indGroupScore
            },
            parenting: {
                doList: profile.parenting.do,
                avoidList: profile.parenting.avoid,
                summary: profile.parenting.summary
            }
        }
    };

    return result;
}
