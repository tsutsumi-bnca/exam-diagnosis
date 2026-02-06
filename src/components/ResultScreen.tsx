import React from 'react';
import { Question, Answers } from '../types';

interface ResultScreenProps {
    questions: Question[];
    answers: Answers;
    onReset: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ questions, answers, onReset }) => {
    // Calculate scores
    const factorScores: { [key: string]: number } = {};

    questions.forEach((q) => {
        const rawValue = answers[q.id] || 3; // Default to 3 if missing
        const score = q.reverse ? 6 - rawValue : rawValue;

        if (!factorScores[q.factor]) {
            factorScores[q.factor] = 0;
        }
        factorScores[q.factor] += score;
    });

    return (
        <div className="card">
            <h2 style={{ textAlign: 'center', color: '#4A90E2' }}>診断結果（仮）</h2>

            <div style={{ margin: '20px 0' }}>
                <h3>因子別スコア</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {Object.entries(factorScores)
                        .sort(([, a], [, b]) => b - a) // Sort by score descending
                        .map(([factor, score]) => (
                            <li key={factor} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
                                <span style={{ fontWeight: 'bold' }}>{factor}</span>
                                <span>{score}点</span>
                            </li>
                        ))}
                </ul>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <h4>回答データ（デバッグ用）</h4>
                <pre style={{ fontSize: '0.7rem', overflow: 'auto' }}>
                    {JSON.stringify(answers, null, 2)}
                </pre>
            </div>

            <div style={{ marginTop: '30px' }}>
                <button className="btn-primary" onClick={onReset}>
                    トップに戻る
                </button>
            </div>
        </div>
    );
};
