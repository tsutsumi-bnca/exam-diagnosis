import React, { useState, useMemo } from 'react';
import { Question, Answers } from '../types';
import { calculateScores, determineDiagnosis } from '../utils/scoring';

interface ResultScreenProps {
    questions: Question[];
    answers: Answers;
    onReset: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ questions, answers, onReset }) => {
    // Calculate scores and diagnosis
    const result = useMemo(() => {
        const scores = calculateScores(questions, answers);
        return determineDiagnosis(scores);
    }, [questions, answers]);

    const [viewMode, setViewMode] = useState<'student' | 'parent'>('student');

    if (!result.diagnosis) {
        return (
            <div className="card">
                <h2>診断エラー</h2>
                <p>診断結果が見つかりませんでした。</p>
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button className="btn-primary" onClick={onReset}>
                        トップに戻る
                    </button>
                </div>
            </div>
        );
    }

    const { diagnosis, scoreResult } = result;
    const content = viewMode === 'student' ? diagnosis.student : diagnosis.parent;

    return (
        <div className="card result-screen">
            <div className="result-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
                <span className="badge" style={{
                    display: 'inline-block',
                    background: '#f0f0f0',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    color: '#666',
                    marginBottom: '10px'
                }}>
                    あなたの学習タイプ
                </span>
                <h1 style={{ color: '#4A90E2', margin: '0 0 10px 0', fontSize: '1.8rem', lineHeight: '1.3' }}>
                    {diagnosis.student.title}
                </h1>
            </div>

            <div className="view-toggle" style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
                <button
                    onClick={() => setViewMode('student')}
                    style={{
                        padding: '10px 25px',
                        border: '1px solid #4A90E2',
                        background: viewMode === 'student' ? '#4A90E2' : 'white',
                        color: viewMode === 'student' ? 'white' : '#4A90E2',
                        borderRadius: '20px 0 0 20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                    }}
                >
                    本人用
                </button>
                <button
                    onClick={() => setViewMode('parent')}
                    style={{
                        padding: '10px 25px',
                        border: '1px solid #4A90E2',
                        background: viewMode === 'parent' ? '#4A90E2' : 'white',
                        color: viewMode === 'parent' ? 'white' : '#4A90E2',
                        borderRadius: '0 20px 20px 0',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                    }}
                >
                    保護者用
                </button>
            </div>

            <div className="diagnosis-content" style={{
                background: '#f8fbff',
                border: '1px solid #e1e8f0',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '30px',
                lineHeight: '1.8'
            }}>
                <h3 style={{ marginTop: 0, color: '#333', fontSize: '1.2rem', marginBottom: '15px' }}>
                    {content.title}
                </h3>
                <p style={{ whiteSpace: 'pre-wrap', margin: 0, color: '#555' }}>
                    {content.message}
                </p>
            </div>

            <div className="score-chart" style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#333' }}>特性バランス</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.entries(scoreResult.factors).map(([factor, score]) => (
                        <div key={factor} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '40px', fontWeight: 'bold', fontSize: '0.9rem', color: '#666' }}>{factor}</div>
                            <div style={{ flex: 1, height: '12px', background: '#eee', borderRadius: '6px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${Math.min((score / 15) * 100, 100)}%`, // Assuming roughly 3 questions per factor eventually, max 15.
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #4A90E2, #63a4ff)',
                                    borderRadius: '6px'
                                }}></div>
                            </div>
                            <div style={{ width: '30px', textAlign: 'right', fontSize: '0.9rem', fontWeight: 'bold' }}>{score}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ textAlign: 'center' }}>
                <button className="btn-primary" onClick={onReset} style={{
                    padding: '12px 40px',
                    fontSize: '1rem',
                    borderRadius: '25px',
                    boxShadow: '0 4px 10px rgba(74, 144, 226, 0.3)'
                }}>
                    もう一度診断する
                </button>
            </div>
        </div>
    );
};
