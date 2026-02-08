
import { runDiagnosis } from '../src/lib/diagnosis';
import questions from '../src/data/questions.json';

// Define Personas with Factor Scores (1-5)
// 1 = Low Trait, 5 = High Trait
// "High A1" means "Likes Structure". "High A2" means "Likes Autonomy".
const personas = {
    "A (Structure/Rules)": {
        desc: "安心・ルール・指示待ち・保守的",
        traits: {
            A1: 5, // Likes structure
            A2: 1, // Dislikes autonomy
            A4: 5, // Likes checks
            A5: 3,
            A6: 3,
            B2: 2, // Low adaptability
            B3: 3,
            B5: 5, // Asks for help
            B6: 3,
            B7: 3,
            C4: 3, // Dialog average
            C1: 3,
            C2: 3,
            C5: 3
        }
    },
    "B (Freedom/Autonomy)": {
        desc: "自由・裁量・計画好き・管理嫌い",
        traits: {
            A1: 1, // Dislikes structure
            A2: 5, // Likes autonomy
            A4: 1, // Dislikes checks
            A5: 3,
            A6: 3,
            B2: 5, // Adaptable
            B3: 4,
            B5: 3,
            B6: 4,
            B7: 4,
            C4: 3,
            C1: 3,
            C2: 5, // Ideas
            C5: 3
        }
    },
    "C (Social/Support)": {
        desc: "対話・共感・見守り・協力",
        traits: {
            A1: 3,
            A2: 2, // Maybe less autonomous?
            A4: 5, // Likes support/checks
            A5: 3,
            A6: 3,
            B2: 3,
            B3: 3,
            B5: 5, // Helper
            B6: 3,
            B7: 3,
            C4: 5, // High Dialog
            C1: 5, // High People
            C2: 3,
            C5: 3
        }
    },
    "D (Solitary/Independent)": {
        desc: "一人・集中・干渉嫌い・マイペース",
        traits: {
            A1: 2,
            A2: 4, // Somewhat autonomous
            A4: 1, // Hates checks
            A5: 3,
            A6: 3,
            B2: 3,
            B3: 4,
            B5: 1, // Solitary resolve
            B6: 5, // High focus
            B7: 3,
            C4: 1, // Low Dialog
            C1: 1,
            C2: 4, // Systems
            C5: 3
        }
    },
    "E (Neutral/Average)": {
        desc: "中間・バランス・極端なし",
        traits: {
            // All defaults to 3 if not specified
        }
    },
    "All 5s (User Check)": {
        desc: "全部「とてもそう思う」(5)で回答",
        fixedAnswer: 5
    },
    "All 1s (User Check)": {
        desc: "全部「そう思わない」(1)で回答",
        fixedAnswer: 1
    }
};

function getAnswer(q: any, p: any) {
    if (p.fixedAnswer) return p.fixedAnswer;

    // Default trait level is 3
    // Use optional chaining and type assertion if needed, but 'p: any' covers it
    const traitLevel = p.traits ? p.traits[q.factor] ?? 3 : 3;

    // C-factor special handling if needed (mapped to base factors in traits for simplicity, or direct C keys)
    // The traits object uses Factor keys (A1, B2, C1, etc).
    // questions.json uses identifiers like "c1-1". factor field says "C1".

    // Logic:
    // If Question is Normal: Answer 5 matches Trait 5.
    // If Question is Reverse: Answer 1 matches Trait 5.
    // So Answer = Reverse ? (6 - Trait) : Trait.

    return q.reverse ? (6 - traitLevel) : traitLevel;
}

async function runTest() {
    console.log("=== Diagnosis Logic Verification ===\n");

    for (const [name, p] of Object.entries(personas)) {
        console.log(`--- Testing Persona: ${name} ---`);
        // @ts-ignore
        console.log(`Desc: ${p.desc}`);

        // Generate answers
        const answers: Record<string, number> = {};
        for (const q of questions) {
            answers[q.id] = getAnswer(q, p);
        }

        // Run Logic
        const result = runDiagnosis(answers);

        // Analyze Output
        console.log(`Result Env: [${result.envType}] ${result.envLabel}`);
        console.log(`Top Strategy: ${result.strategy.title}`);
        console.log(`School Fit: Private=${result.indicators.school.private.toFixed(2)}, Public=${result.indicators.school.public.toFixed(2)}`);
        console.log(`Conflict Tags: ${result.conflictTags.map(t => t.key).join(", ") || "None"}`);
        console.log("\n");
    }
}

runTest();
