import React, { useState } from 'react';
import { Question } from '../types';

interface QuestionScreenProps {
    questions: Question[];
    onAnswer: (questionId: string, value: number) => void;
    onBack: () => void;
    onFinish: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
    questions,
    onAnswer,
    onBack,
    onFinish,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null); // To track visual feedback

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleAnswer = (value: number) => {
        if (selectedOption !== null) return; // Prevent double clicks during delay

        setSelectedOption(value);

        // Short delay to show the "Selected" state animation/color
        setTimeout(() => {
            onAnswer(currentQuestion.id, value);
            setSelectedOption(null); // Reset selection tracking

            if (currentIndex < questions.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                onFinish();
            }
            // Scroll to top of card if needed, though usually fixed height
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 350);
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            onBack();
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--primary)', padding: '1rem 1.5rem 2rem' }}>
            <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                {/* Header: Progress */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    gap: '1rem'
                }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white', width: '60px' }}>
                        Q. {currentIndex + 1}
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 'normal' }}> / {questions.length}</span>
                    </div>
                    <div style={{
                        flex: 1,
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: 'white',
                            borderRadius: '3px',
                            transition: 'width 0.4s ease'
                        }}></div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="card" style={{
                    padding: '2rem 1.5rem',
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    {/* Question Text */}
                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: 'var(--text-main)',
                        lineHeight: '1.6',
                        marginBottom: '2rem',
                        textAlign: 'left'
                    }}>
                        {currentQuestion.text}
                    </h2>

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <OptionButton
                            label="とてもそう思う"
                            value={5}
                            isSelected={selectedOption === 5}
                            onClick={handleAnswer}
                        />
                        <OptionButton
                            label="ややそう思う"
                            value={4}
                            isSelected={selectedOption === 4}
                            onClick={handleAnswer}
                        />
                        <OptionButton
                            label="どちらともいえない"
                            value={3}
                            isSelected={selectedOption === 3}
                            onClick={handleAnswer}
                        />
                        <OptionButton
                            label="あまりそう思わない"
                            value={2}
                            isSelected={selectedOption === 2}
                            onClick={handleAnswer}
                        />
                        <OptionButton
                            label="全くそう思わない"
                            value={1}
                            isSelected={selectedOption === 1}
                            onClick={handleAnswer}
                        />
                    </div>

                    {/* Footer Nav */}
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <button
                            onClick={handleBack}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-sub)',
                                textDecoration: 'underline',
                                fontSize: '0.85rem'
                            }}
                        >
                            ひとつ前に戻る
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OptionButton = ({ label, value, isSelected, onClick }: { label: string, value: number, isSelected: boolean, onClick: (v: number) => void }) => {
    return (
        <button
            className={`btn-select ${isSelected ? 'selected' : ''}`}
            onClick={() => onClick(value)}
        >
            <span>{label}</span>
            {/* Circle Icon */}
            <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid ' + (isSelected ? 'white' : '#e2e8f0'),
                background: isSelected ? 'white' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
            }}>
                {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
            </div>
        </button>
    );
};
