import React from 'react';

import { shareUrl } from '../lib/share';

interface StartScreenProps {
    onStart: () => void;
    onShowHistory?: () => void;
}

const ShareAppButton = () => {
    const handleAppShare = async () => {
        const appUrl = window.location.origin + window.location.pathname;
        const shared = await shareUrl(appUrl, "進路コンパス - 高校受験診断");
        if (!shared) alert("リンクをコピーしました！");
    };

    return (
        <button
            onClick={handleAppShare}
            style={{
                marginTop: '1.5rem',
                background: 'rgba(46, 184, 134, 0.1)',
                border: '1px solid #2eb886',
                color: '#2eb886',
                borderRadius: '99px',
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 'bold',
                cursor: 'pointer'
            }}
        >
            <span>📣</span>
            このアプリを教える
        </button>
    );
};

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onShowHistory }) => {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#f7f9fb',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Green Header Background (Top 40%) */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '40%',
                backgroundColor: 'var(--bg-green-header)',
                zIndex: 0,
                borderBottomLeftRadius: '0',
                borderBottomRightRadius: '0'
            }}></div>

            {/* Content Container */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '480px',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh'
            }}>

                {/* Header Text (White on Green) */}
                <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        color: 'white',
                        margin: '0',
                        lineHeight: '1.2'
                    }}>
                        進路コンパス
                    </h1>
                    <p style={{
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginTop: '0.5rem'
                    }}>
                        キミだけの高校受験スタイル診断
                    </p>
                </div>

                {/* Main Card */}
                <div className="card" style={{
                    width: '100%',
                    padding: '3rem 2rem',
                    borderRadius: '20px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {/* Compass Icon Circle */}
                    <div className="circle-progress-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            {/* Outer Circle */}
                            <circle cx="12" cy="12" r="10"></circle>
                            {/* Ticks */}
                            <line x1="12" y1="2" x2="12" y2="4"></line>
                            <line x1="12" y1="20" x2="12" y2="22"></line>
                            <line x1="2" y1="12" x2="4" y2="12"></line>
                            <line x1="20" y1="12" x2="22" y2="12"></line>
                            {/* Needle */}
                            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="var(--primary)" fillOpacity="0.1"></polygon>
                        </svg>
                    </div>

                    {/* Copy */}
                    <p style={{
                        textAlign: 'center',
                        fontSize: '0.95rem',
                        color: 'var(--text-main)',
                        lineHeight: '1.8',
                        fontWeight: 500
                    }}>
                        24問の質問に答えて、あなたにぴったりの<br />
                        学習スタイルや志望校選びのヒントを見つけよう！
                    </p>

                    {/* CTA Button */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <button
                            className="btn-primary"
                            onClick={onStart}
                            style={{
                                width: '100%',
                                maxWidth: '300px',
                                height: '56px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                borderRadius: '9999px',
                                boxShadow: '0 10px 15px -3px rgba(46, 184, 134, 0.3)',
                                marginTop: '1rem'
                            }}
                        >
                            診断を始める
                        </button>

                        {onShowHistory && (
                            <button
                                onClick={onShowHistory}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-sub)',
                                    fontSize: '0.9rem',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    padding: '0.5rem'
                                }}
                            >
                                保存した結果を見る
                            </button>
                        )}
                        <ShareAppButton />
                    </div>
                </div>

                {/* Footer Icons (Moved up) */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    width: '100%',
                    marginBottom: '2rem'
                }}>
                    <FooterItem icon={<ClockIcon />} label="所要時間：約3分" />
                    <FooterItem icon={<CheckCircleIcon />} label="完全無料" />
                    <FooterItem icon={<UserPlusIcon />} label="登録不要" />
                </div>

            </div>
        </div>
    );
};

// Simple Footer Item Component
const FooterItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ color: 'var(--primary)', width: '24px', height: '24px' }}>
            {icon}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)', fontWeight: '600' }}>{label}</span>
    </div>
);

// Inline SVGs (Lucide style)
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const UserPlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <line x1="20" y1="8" x2="20" y2="14"></line>
        <line x1="23" y1="11" x2="17" y2="11"></line>
    </svg>
);
