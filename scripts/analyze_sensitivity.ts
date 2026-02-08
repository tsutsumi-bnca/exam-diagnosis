
import { runDiagnosis } from '../src/lib/diagnosis';
import questions from '../src/data/questions.json';

// Base: Neutral (All 3s)
const baseAnswers: Record<string, number> = {};
questions.forEach(q => baseAnswers[q.id] = 3);

function runSensitivityTest() {
    console.log("=== Sensitivity Analysis (Base: All 3s) ===\n");

    const baseResult = runDiagnosis(baseAnswers);
    console.log(`Base Result: [${baseResult.envType}] ${baseResult.envLabel}`);
    console.log(`Base Strategy: ${baseResult.strategy.title}`);
    console.log(`Base Cram: ${baseResult.indicators.cram.type}`);
    console.log(`Base School: Private=${baseResult.indicators.school.private.toFixed(2)}, Public=${baseResult.indicators.school.public.toFixed(2)}\n`);

    console.log("--- Single Answer Impact (Changing 3 -> 5) ---");

    for (const q of questions) {
        // Create a copy
        const testAnswers = { ...baseAnswers };
        // Change one answer to 5 (Strongly Agree)
        testAnswers[q.id] = 5;

        const res = runDiagnosis(testAnswers);

        const changes: string[] = [];
        if (res.envType !== baseResult.envType) changes.push(`Env: ${res.envType}`);
        if (res.strategy.key !== baseResult.strategy.key) changes.push(`Strategy: ${res.strategy.key}`);
        if (res.indicators.cram.type !== baseResult.indicators.cram.type) changes.push(`Cram: ${res.indicators.cram.type}`);

        // Check Magnitude of School Score Change
        const privateDiff = res.indicators.school.private - baseResult.indicators.school.private;
        const publicDiff = res.indicators.school.public - baseResult.indicators.school.public;

        if (changes.length > 0 || Math.abs(privateDiff) > 0.05 || Math.abs(publicDiff) > 0.05) {
            console.log(`[Q: ${q.id}] ${q.text.substring(0, 20)}...`);
            if (changes.length > 0) console.log(`  -> CHANGED: ${changes.join(", ")}`);
            if (Math.abs(privateDiff) > 0.05) console.log(`  -> Private Score: ${privateDiff > 0 ? '+' : ''}${privateDiff.toFixed(2)}`);
            if (Math.abs(publicDiff) > 0.05) console.log(`  -> Public Score: ${publicDiff > 0 ? '+' : ''}${publicDiff.toFixed(2)}`);
        }
    }
}

runSensitivityTest();
