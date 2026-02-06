import React from 'react';

interface StartScreenProps {
    onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    return (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h1 style={{ color: '#4A90E2', marginBottom: '10px' }}>高校受験スタイル診断</h1>
            <p style={{ marginBottom: '40px', color: '#666', lineHeight: '1.6' }}>
                25問の質問に答えて、<br />
                あなたにぴったりの学習スタイルや<br />
                志望校選びのヒントを見つけよう！
            </p>
            <button className="btn-primary" onClick={onStart}>
                診断を始める
            </button>
            <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#999' }}>
                所要時間：約3分 / 完全無料 / 登録不要
            </p>
        </div>
    );
};
