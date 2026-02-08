import React, { useState, useMemo } from 'react';
import { Answers } from '../types';
import { runDiagnosis } from '../lib/diagnosis';
import {
    PARENT_WORDING
} from '../data/result_templates';
import { saveToHistory, generateShareUrl, shareUrl } from '../lib/share';

interface ResultScreenProps {
    answers: Answers;
    onReset: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ answers, onReset }) => {
    const result = useMemo(() => runDiagnosis(answers), [answers]);
    const [viewMode, setViewMode] = useState<'student' | 'parent'>('student');
    const isParent = viewMode === 'parent';

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleParentView = () => {
        setViewMode('parent');
        scrollToTop();
    };

    const handleBackToStudent = () => {
        setViewMode('student');
        scrollToTop();
    };

    // Helper to determine School Label
    const getSchoolLabel = () => {
        const p = result.indicators.school.private;
        const u = result.indicators.school.public;
        if (p > u + 0.1) return { label: "私立向き（構造×支援）", color: "#2eb886" }; // Green
        if (u > p + 0.1) return { label: "公立向き（自律×自由）", color: "#3b82f6" }; // Blue
        return { label: "どちらも適性あり（要件次第）", color: "#8b5cf6" }; // Purple
    };

    const schoolInfo = getSchoolLabel();

    // Helper to determine Cram Label
    const getCramLabel = () => {
        const type = result.indicators.cram.type;
        if (type === 'individual') return { label: "個別指導向き", color: "#fca5a5" }; // Soft Red
        if (type === 'group') return { label: "集団塾向き", color: "#fdba74" }; // Soft Orange
        return { label: "ハイブリッド・使い分け", color: "#8b5cf6" }; // Purple
    };

    const cramInfo = getCramLabel();

    // --- Components ---

    // --- Components ---

    const GaugeBar = ({ label, value, color, judgment }: { label: string, value: number, color: string, judgment?: string }) => (
        <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-sub)' }}>
                <span>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {judgment && <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'normal' }}>{judgment}</span>}
                    <span>{Math.round(value * 100)}%</span>
                </div>
            </div>
            <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                    width: `${value * 100}%`,
                    height: '100%',
                    background: color,
                    borderRadius: '4px',
                    transition: 'width 1s ease-out'
                }} />
            </div>
        </div>
    );

    const ComfortCard = ({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) => (
        <div className="card" style={{
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow)', // Softer shadow
            border: 'none',
            padding: '2rem',
            marginBottom: '2rem',
            background: 'white',
            ...style
        }}>
            {children}
        </div>
    );

    const CollapsibleSection = ({ icon, title, summary, color = 'var(--text-main)', children, style }: { icon: string, title: string, summary: string, color?: string, children: React.ReactNode, style?: React.CSSProperties }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <ComfortCard style={style}>
                <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            color: color,
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span>{icon}</span>
                            {title}
                        </h3>
                        <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>{isOpen ? '▲' : '▼ 詳しく見る'}</span>
                    </div>
                    {/* One-line Summary (Always Visible) */}
                    <p style={{ fontWeight: 'bold', fontSize: '1rem', color: color, marginBottom: isOpen ? '1.5rem' : '0', lineHeight: '1.5' }}>
                        {summary}
                    </p>
                </div>
                {isOpen && (
                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem' }}>
                        {children}
                    </div>
                )}
            </ComfortCard>
        );
    };

    const SectionHeader = ({ icon, title, color = 'var(--text-main)' }: { icon?: string, title: string, color?: string }) => (
        <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: color,
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        }}>
            {icon && <span>{icon}</span>}
            {title}
        </h3>
    );

    // --- Blocks ---

    // 1. Diagnosis Score / Main Result
    const MainResultBlock = ({ isParent }: { isParent: boolean }) => (
        <ComfortCard style={{ textAlign: 'center', position: 'relative', overflow: 'hidden', padding: '0' }}>
            {/* Solid Green Header Background #2eb886 */}
            <div style={{ background: '#2eb886', padding: '2.5rem 1.5rem 1.5rem' }}>
                <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    background: 'white',
                    borderRadius: '99px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    color: '#2eb886',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    marginBottom: '1rem'
                }}>
                    {isParent ? "お子さまの学習タイプ" : "あなたの学習タイプ"}
                </div>
                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: '800',
                    color: 'white',
                    lineHeight: '1.4',
                    marginBottom: '1rem'
                }}>
                    {result.envLabel}
                </h1>

                {/* Conclusion of the day */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'center',
                    marginBottom: '0.5rem'
                }}>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', marginBottom: '0.25rem', fontWeight: 'bold' }}>今日の結論</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>
                        {result.envContent.conclusion}
                    </div>
                </div>
            </div>

            <div style={{ padding: '2rem 1.5rem' }}>
                <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-main)', textAlign: 'left' }}>
                    {result.envContent.lead}
                </p>
            </div>
        </ComfortCard>
    );

    // 2. Visual Graphs (School & Cram Fit)
    const FitVisualizationBlock = () => {
        // School Scores
        const pScore = result.indicators.school.private;
        const uScore = result.indicators.school.public;
        const sDiff = pScore - uScore;

        const getJudgement = (diff: number) => {
            if (diff >= 0.1) return "おすすめ";
            if (diff >= 0.05) return "ややおすすめ";
            if (diff <= -0.1) return "条件次第";
            if (diff <= -0.05) return "条件次第";
            return "どちらも適性あり";
        };

        const pJudge = Math.abs(sDiff) < 0.05 ? "どちらも適性あり" : getJudgement(sDiff);
        const uJudge = Math.abs(sDiff) < 0.05 ? "どちらも適性あり" : getJudgement(-sDiff);

        // Cram Scores
        const iScore = result.indicators.cram.individual;
        const gScore = result.indicators.cram.group;
        const cDiff = iScore - gScore;

        const iJudge = Math.abs(cDiff) < 0.05 ? "どちらも適性あり" : getJudgement(cDiff);
        const gJudge = Math.abs(cDiff) < 0.05 ? "どちらも適性あり" : getJudgement(-cDiff);


        return (
            <ComfortCard>
                <SectionHeader icon="📊" title="環境フィット度（相性）" />

                <div style={{ marginBottom: '2.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-sub)', marginBottom: '0.75rem', textAlign: 'center' }}>
                        学校のスタイル
                    </h4>

                    {/* Tag Result */}
                    <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.6rem 1.25rem',
                            borderRadius: '999px',
                            background: schoolInfo.color,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            {schoolInfo.label}
                        </span>
                        <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                            {isParent ? result.indicators.school.texts.parent : result.indicators.school.texts.child}
                        </div>
                    </div>

                    <div style={{ padding: '0 0.5rem' }}>
                        <GaugeBar label="私立的（構造・手厚さ）" value={pScore} color="#2eb886" judgment={pJudge} />
                        <GaugeBar label="公立的（自律・自由）" value={uScore} color="#3b82f6" judgment={uJudge} />
                    </div>
                </div>

                // Cram section in FitVisualizationBlock
                <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-sub)', marginBottom: '0.75rem', textAlign: 'center' }}>
                        塾・学習環境
                    </h4>

                    {/* Tag Result */}
                    <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.6rem 1.25rem',
                            borderRadius: '999px',
                            background: cramInfo.color,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            {/* Use label from result if available (updated logic), else fallback */}
                            {result.indicators.cram.label || cramInfo.label}
                        </span>

                        {/* Detail text (Bold) */}
                        {result.indicators.cram.detail && (
                            <div style={{ marginTop: '1rem', fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                                {result.indicators.cram.detail}
                            </div>
                        )}

                        {/* Description text */}
                        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                            {result.indicators.cram.text}
                        </div>
                    </div>

                    <div style={{ padding: '0 0.5rem' }}>
                        <GaugeBar label="個別指導（ペース重視）" value={iScore} color="#fca5a5" judgment={iJudge} />
                        <GaugeBar label="集団指導（競争・仲間）" value={gScore} color="#fdba74" judgment={gJudge} />
                    </div>
                </div>
            </ComfortCard>
        );
    };

    // 3. Actionable Advice (Do / Avoid)
    const ActionItem = ({ text, type }: { text: string, type: 'do' | 'avoid' }) => (
        <div style={{
            display: 'flex',
            gap: '0.75rem',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            color: type === 'do' ? '#0c4a6e' : '#881337',
            marginBottom: '0.5rem',
            alignItems: 'flex-start'
        }}>
            <span style={{ fontSize: '1.1rem', lineHeight: '1' }}>{type === 'do' ? '✅' : '⚠️'}</span>
            <span>{text.replace(/[「」]/g, '')}</span>
        </div>
    );

    const AdviceBlock = () => (
        <CollapsibleSection
            icon="💡"
            title="親子の関わり方ヒント"
            summary={result.indicators.parenting.summary}
        >
            <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ background: 'var(--accent-blue)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0369a1', marginBottom: '1rem' }}>
                        推奨アクション (Do)
                    </h4>
                    {result.indicators.parenting.doList.slice(0, 3).map((txt, i) => (
                        <ActionItem key={i} text={txt} type="do" />
                    ))}
                </div>

                <div style={{ background: 'var(--accent-pink)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#be123c', marginBottom: '1rem' }}>
                        控えるアクション (Avoid)
                    </h4>
                    {result.indicators.parenting.avoidList.slice(0, 3).map((txt, i) => (
                        <ActionItem key={i} text={txt} type="avoid" />
                    ))}
                </div>
            </div>
        </CollapsibleSection>
    );

    // 4. Caution / Stress Factors
    const StressBlock = () => {
        if (!result.envContent.stumble) return null;

        return (
            <CollapsibleSection
                icon="🛡️"
                title="気をつけるポイント"
                summary={result.envContent.stumbleSummary || "つまずきポイントを確認"}
                color="#b45309"
                style={{ background: '#fffbeb' }} // Very light yellow
            >
                <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#92400e', marginBottom: '0.5rem' }}>つまずきパターン</h4>
                    <p style={{ fontSize: '0.9rem', color: '#92400e', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                        {result.envContent.stumble}
                    </p>
                </div>
            </CollapsibleSection>
        );
    };

    // Shared Button Style from StartScreen
    const buttonStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: '300px',
        height: '56px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        borderRadius: '9999px',
        boxShadow: '0 10px 15px -3px rgba(46, 184, 134, 0.3)',
        marginBottom: '1.5rem',
        background: '#2eb886',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem' // Center it
    };

    // --- Actions ---

    const handleShare = async () => {
        const url = generateShareUrl(answers);
        const shared = await shareUrl(url);
        if (!shared) {
            alert("リンクをコピーしました！");
        }
    };

    const handleSave = () => {
        saveToHistory(answers, result);
        alert("結果をブラウザに保存しました。\nトップ画面の「保存した結果」からいつでも見返せます。");
    };

    const ActionButtons = () => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '300px', margin: '0 auto 2rem' }}>
            <button
                onClick={handleSave}
                style={{
                    padding: '0.75rem',
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    color: '#4b5563',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                }}
            >
                <span>💾</span>
                <span>保存する</span>
            </button>
            <button
                onClick={handleShare}
                style={{
                    padding: '0.75rem',
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    color: '#4b5563',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                }}
            >
                <span>🔗</span>
                <span>共有する</span>
            </button>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f0fdf4', padding: '2rem 1.5rem 6rem' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                {/* Mode Switcher / Back Button (Top) */}
                {isParent && (
                    <div style={{ marginBottom: '1rem' }}>
                        <button
                            onClick={handleBackToStudent}
                            style={{
                                background: 'rgba(46, 184, 134, 0.1)',
                                border: '1px solid #2eb886',
                                color: '#2eb886',
                                borderRadius: '99px',
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            ← 生徒（本人）モードに戻る
                        </button>
                    </div>
                )}

                <MainResultBlock isParent={isParent} />
                <ActionButtons />
                <FitVisualizationBlock />
                <StressBlock />

                {isParent ? (
                    <>
                        <AdviceBlock />
                        <ComfortCard>
                            <SectionHeader icon="🗣️" title="声かけの変換" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {PARENT_WORDING.rewrites.map((rw, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', gap: '0.75rem', padding: '1rem', background: '#f3f4f6', borderRadius: '12px' }}>
                                        <div style={{ flex: 1, color: '#6b7280', fontSize: '0.85rem' }}>{rw.ng}</div>
                                        <div style={{ fontWeight: 'bold', color: '#9ca3af' }}>→</div>
                                        <div style={{ flex: 1, color: 'var(--primary)', fontWeight: '700' }}>{rw.ok}</div>
                                    </div>
                                ))}
                            </div>
                        </ComfortCard>

                        <ActionButtons />

                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <button
                                onClick={handleBackToStudent}
                                style={buttonStyle}
                            >
                                生徒（本人）モードに戻る
                            </button>
                            <div style={{ marginTop: '1rem' }}>
                                <button
                                    onClick={onReset}
                                    style={{ background: 'none', border: 'none', color: '#047857', fontSize: '0.9rem', textDecoration: 'underline', cursor: 'pointer' }}
                                >
                                    診断トップに戻る
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    // Student View
                    <>
                        <ComfortCard>
                            <SectionHeader icon="🚀" title="最初のアクション" />
                            {/* Summary */}
                            <p style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem', lineHeight: '1.5' }}>
                                {result.strategy.summary}
                            </p>
                            <div style={{ background: 'var(--primary-soft)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                                <p style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                                    {result.strategy.title}
                                </p>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.7' }}>
                                    {result.strategy.firstStep}
                                </p>
                            </div>
                        </ComfortCard>

                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <p style={{ fontSize: '0.9rem', color: '#065f46', marginBottom: '1.5rem', opacity: 0.9 }}>
                                保護者の方にも結果を見てもらいましょう
                            </p>
                            <button
                                onClick={handleParentView}
                                style={buttonStyle}
                            >
                                保護者の方へ（詳しい解説）
                            </button>

                            <ActionButtons />

                            <div style={{ marginTop: '1rem' }}>
                                <button
                                    onClick={onReset}
                                    style={{ background: 'none', border: 'none', color: '#047857', fontSize: '0.9rem', textDecoration: 'underline', cursor: 'pointer' }}
                                >
                                    診断トップに戻る
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
