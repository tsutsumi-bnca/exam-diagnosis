export type EnvType = "ENV_PRIVATE" | "ENV_PUBLIC" | "ENV_NEUTRAL";
export type ConflictTag =
    | "TAG_FATIGUE"
    | "TAG_BLAME_SENSITIVE"
    | "TAG_OVERMANAGE"
    | "TAG_OVERLEAVE";

export type StrategyKey =
    | "STRAT_SPRINT"
    | "STRAT_PLAN_ADAPT"
    | "STRAT_REVIEW_GROW"
    | "STRAT_WITH_SUPPORT"
    | "STRAT_BOUNCE_BACK";

export type AxisKey =
    | "AXIS_PEOPLE_HELP"
    | "AXIS_SYSTEM"
    | "AXIS_CREATE"
    | "AXIS_DIALOG"
    | "AXIS_UNCERTAIN";

export const FIXED_STUDENT_GUARD = {
    headline: "合わないやり方を、がんばらなくていい。",
    body:
        "この診断はキミを評価しない。\n" +
        "「伸びやすい条件」を見つけるだけ。\n" +
        "当てはまるところだけ、持っていけばOK。",
};

export const FIXED_PARENT_GUARD = {
    headline: "これは評価ではありません。",
    body:
        "お子さまを評価するための診断ではありません。\n" +
        "親子でズレが起きやすいポイントを“先に共有”するためのものです。",
};

// ---------------------------------------------------------
// NEW DATA STRUCTURE FOR FINAL TEXTS
// ---------------------------------------------------------

export const ENV_TITLES: Record<EnvType, string> = {
    ENV_NEUTRAL: "どこでも伸びる。伸ばし方が鍵。",
    ENV_PRIVATE: "整った環境で、一気に伸びる。",
    ENV_PUBLIC: "自由な環境で、力を発揮する。",
};

type EnvProfile = {
    conclusion: string; // 今日の結論（1行）
    lead: string; // 本人向け説明
    fitLabel: { school: string; cram: string }; // 環境フィット表示用ラベル
    stumble: {
        summary: string; // つまずき（要約）
        detail: string; // つまずき（詳細）
    };
    action: {
        summary: string; // 最初のアクション（要約）
        title: string; // 見出し
        steps: string[]; // 具体的なステップ
    };
    parenting: {
        summary: string; // 親向け要約（Do/Avoidの傾向）
        do: string[];
        avoid: string[];
    };
};

export const ENV_PROFILE: Record<EnvType, EnvProfile> = {
    ENV_NEUTRAL: {
        conclusion: "「やり方」さえ決まれば、どこでも力を発揮できるタイプ",
        lead:
            "環境に左右されにくいタイプ。\n" +
            "場所より「やり方」を先に決めると、力が出やすい。",
        fitLabel: {
            school: "どちらも適性あり（要件次第）",
            cram: "集団塾向き（刺激で伸びる）" // Default label, can be overridden by score? User said "Or Individual". Logic will handle.
        },
        stumble: {
            summary: "「始め方」が決まらないと、動けなくなる。",
            detail:
                "自由すぎると、最初の一歩が止まりやすい。\n" +
                "目標が曖昧だと力が分散する。"
        },
        action: {
            summary: "計画→調整で勝つ",
            title: "まず「やる順番」を決める",
            steps: [
                "週1回、やり方だけ見直す",
                "迷ったら「質問」で解決する",
                "「できた」を記録する"
            ]
        },
        parenting: {
            summary: "プロセスへの共感と、小さな計画の共有。",
            do: [
                "「小さな計画を一緒に確認する」",
                "「結果より“やり方”を聞く」",
                "「質問できる雰囲気を作る」"
            ],
            avoid: [
                "「放任しすぎる」",
                "「一発で決めさせる」",
                "「丸投げ」"
            ]
        }
    },
    ENV_PRIVATE: {
        conclusion: "「型」と「安心感」があると、力が一気に出るタイプ",
        lead:
            "決まりやサポートがあるほど、集中しやすい。\n" +
            "「考えなくていい部分」が整うと、実力が出る。",
        fitLabel: {
            school: "私立向き（構造・支援）",
            cram: "個別指導向き"
        },
        stumble: {
            summary: "自由すぎると、動き出せない。",
            detail:
                "判断を全部自分で抱えると疲れやすい。\n" +
                "失敗を気にしすぎて手が止まることがある。"
        },
        action: {
            summary: "型に乗る",
            title: "毎日の「やること」を固定する",
            steps: [
                "チェック役を決める",
                "ルーティンを作る",
                "迷う時間を減らす"
            ]
        },
        parenting: {
            summary: "「見守り」と「確認」で、安心感を作る。",
            do: [
                "「進み具合を短く確認する」",
                "「“ここまででOK”を明確にする」",
                "「報告を褒める」"
            ],
            avoid: [
                "「突然の変更」",
                "「自立を急がせる声かけ」",
                "「突き放す」"
            ]
        }
    },
    ENV_PUBLIC: {
        conclusion: "自分で決めて動くほど、やる気が加速するタイプ",
        lead:
            "自分で決めるほど、集中できる。\n" +
            "干渉が少ない方が、長く続く。",
        fitLabel: {
            school: "公立向き（自律・自由）",
            cram: "集団塾向き"
        },
        stumble: {
            summary: "管理されすぎるとやる気が落ちる。",
            detail:
                "細かい指示が続くと反発しやすい。\n" +
                "納得感がないと動けない。"
        },
        action: {
            summary: "選択肢を持つ",
            title: "2択でやり方を選ぶ",
            steps: [
                "ゴールだけ決めて進める",
                "自分で決めた約束は守る",
                "納得できる方法を探す"
            ]
        },
        parenting: {
            summary: "「自分で決める」を尊重し、壁だけを取り除く。",
            do: [
                "「任せる前に“目的”を共有」",
                "「結果よりプロセスを尊重」",
                "「相談されるまで待つ」"
            ],
            avoid: [
                "「細かい管理」",
                "「正解を先に言う」",
                "「先回り」"
            ]
        }
    }
};

// Keeping these for existing types compatibility if needed, but ENV_PROFILE supersedes typical usage.
// We will modify diagnosis.ts to use ENV_PROFILE.

export const SCHOOL_INDICATOR = {
    child: "どっちが上、じゃない。キミが力を出しやすい環境の話。",
    parent: "管理やサポートの見通しがあると実力が出やすい／自走できると自由度が高い環境でも伸びる、の“傾向”です。"
};

export const CRAM_SCHOOL_INDICATOR = {
    types: {
        individual: {
            label: "個別指導向き（ペース重視）",
            detail: "自分のペースで、深く理解するタイプ",
            desc: "分からないところをその場で解消できると安心。\n周りを気にせず集中できる。"
        },
        group: {
            label: "集団塾向き（刺激・競争）",
            detail: "周りの熱で、エンジンがかかるタイプ",
            desc: "仲間や競争が力になる。\n空気感がある方が続く。"
        },
        hybrid: {
            label: "使い分け・ハイブリッド",
            detail: "両方の良いとこ取りができるタイプ",
            desc: "刺激も安心も両方使える。"
        }
    },
    warning: "どの塾が正解か、じゃない。キミが安心して力を出せる場の話。"
};

export const PARENT_WORDING = {
    rewrites: [
        { ng: "なんでできないの？", ok: "どこで止まった？" },
        { ng: "ちゃんとやりなさい", ok: "今日はどこまでやる？" },
        { ng: "また同じミス", ok: "次はどう変える？" },
    ],
    guide5min: [
        "最近、一番しんどかったのはいつ？",
        "その時、どうしてほしかった？",
        "次に同じことが起きたら、どうするのがよさそう？（解決しなくてOK）",
    ],
};

// Legacy exports to prevent breakages before diagnosis.ts update
// Legacy exports
export const CONFLICT_TAGS: any = {};
export const STRATEGIES: any = {};
export const PARENTING_TIPS_LIST: any = {};
export const ENV_STUDENT: any = {};

export const AXES: Record<AxisKey, { label: string; ideas: string[]; question: string }> = {
    AXIS_PEOPLE_HELP: {
        label: "「人の役に立つ」",
        ideas: ["誰かの支えになる", "直接ありがとうと言われる", "チームの和を作る"],
        question: "「誰かのため」だと、力が湧いてくる？"
    },
    AXIS_SYSTEM: {
        label: "「仕組み」を作る",
        ideas: ["ルールを整える", "効率をよくする", "再現性を作る"],
        question: "ごちゃごちゃしたものを整理するのが好き？"
    },
    AXIS_CREATE: {
        label: "「新しいもの」を生み出す",
        ideas: ["ゼロから形にする", "自分らしさを表現する", "今までないものを作る"],
        question: "「自分だけのオリジナル」を作りたい？"
    },
    AXIS_DIALOG: {
        label: "「言葉」で伝える",
        ideas: ["話して解決する", "文章で表現する", "誰かの想いを届ける"],
        question: "言葉で誰かの心を動かしたい？"
    },
    AXIS_UNCERTAIN: {
        label: "「問い」を探究する",
        ideas: ["正解のないことを考える", "本質を見抜く", "新しい仮説を立てる"],
        question: "「なぜ？」を考える時間が好き？"
    }
};
