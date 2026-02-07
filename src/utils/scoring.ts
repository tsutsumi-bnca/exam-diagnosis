import { Question, Answers } from '../types';
import logicData from '../data/diagnosis_logic.json';

export interface ScoreResult {
    factors: { [key: string]: number };
    total: number;
}

export interface DiagnosisContent {
    title: string;
    message: string;
}

export interface DiagnosisResult {
    scoreResult: ScoreResult;
    diagnosis: {
        id: string;
        student: DiagnosisContent;
        parent: DiagnosisContent;
    } | null;
    confidence: 'High' | 'Medium' | 'Low';
}

/**
 * Calculates scores for each factor based on user answers.
 */
export const calculateScores = (questions: Question[], answers: Answers): ScoreResult => {
    const factors: { [key: string]: number } = {};
    let total = 0;

    questions.forEach((q) => {
        const rawValue = answers[q.id] || 3; // Default to neutral if unanswered (though UI prevents this)
        const score = q.reverse ? 6 - rawValue : rawValue;

        if (!factors[q.factor]) {
            factors[q.factor] = 0;
        }
        factors[q.factor] += score;
        total += score;
    });

    return { factors, total };
};

/**
 * Determines the diagnosis result based on logic rules.
 * This is a simplified implementation to be expanded with actual logic.
 */
export const determineDiagnosis = (scores: ScoreResult): DiagnosisResult => {
    // 1. Find the matching rule with the highest priority
    // TODO: Implement the actual complex condition matching logic here
    // For MVP, we'll just take a simple approach or the first rule for demo

    // Placeholder logic: Check A1 score
    let matchedRule = logicData.rules[0]; // Default to first rule

    // Example of simple condition check (to be replaced with dynamic check)
    if (scores.factors['A1'] >= 5) {
        matchedRule = logicData.rules.find(r => r.id === 'type_A_env_sensitive') || matchedRule;
    }

    // 2. Calculate confidence (Placeholder)
    // TODO: Implement ATT-1 check and consistency check
    const confidence = 'High';

    return {
        scoreResult: scores,
        diagnosis: matchedRule ? {
            id: matchedRule.id,
            student: matchedRule.content.student as DiagnosisContent,
            parent: matchedRule.content.parent as DiagnosisContent
        } : null,
        confidence
    };
};
