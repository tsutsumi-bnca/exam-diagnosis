import React, { useEffect, useState } from 'react';
import { Answers } from '../types';
import { getHistory, deleteFromHistory, SavedResult } from '../lib/share';

interface HistoryScreenProps {
    onLoad: (answers: Answers) => void;
    onBack: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onLoad, onBack }) => {
    const [history, setHistory] = useState<SavedResult[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("この履歴を削除しますか？")) {
            setHistory(deleteFromHistory(id));
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem 1.5rem' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={onBack}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            marginRight: '1rem',
                            padding: '0.5rem'
                        }}
                    >
                        ←
                    </button>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>
                        保存した診断結果
                    </h1>
                </div>

                {history.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-sub)', marginTop: '4rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
                        <p>保存された履歴はありません</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {history.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => onLoad(item.ans)}
                                style={{
                                    background: 'white',
                                    padding: '1.25rem',
                                    borderRadius: '16px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'transform 0.1s'
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                        {new Date(item.d).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>
                                        {item.summary.envLabel}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(item.id, e)}
                                    style={{
                                        background: '#fee2e2',
                                        color: '#ef4444',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0.5rem 0.75rem',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    削除
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
