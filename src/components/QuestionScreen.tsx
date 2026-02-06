import React from 'react';
import { Question, Answers } from '../types';

interface QuestionScreenProps {
    questions: Question[];
    answers: Answers;
    onAnswer: (questionId: string, value: number) => void;
    onBack: () => void;
    onFinish: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
    questions,
    answers,
    onAnswer,
    onBack,
    onFinish,
}) => {
    // Find the first unanswered question index, or last question if all answered layout logic differs
    // But usually we just track current index in parent or here. 
    // For MVP simplicity, let's track "current question index" here.
    // Actually, parent might be better to manage state, but let's keep UI logic here for now.
    // Wait, the prompt says "1問ずつ表示", so we need an index state.

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleAnswer = (value: number) => {
        onAnswer(currentQuestion.id, value);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onFinish();
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            onBack(); // Back to start screen
        }
    };

    return (
        <div className="card">
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <div style={{ marginBottom: '10px', color: '#999', fontSize: '0.9rem' }}>
                Q. {currentIndex + 1} / {questions.length}
            </div>

            <h2 style={{ minHeight: '80px', marginBottom: '30px', fontSize: '1.2rem', lineHeight: '1.5' }}>
                {currentQuestion.text}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn-secondary" onClick={() => handleAnswer(5)} style={{ backgroundColor: '#4A90E2', color: 'white' }}>
                    とてもあてはまる
                </button>
                <button className="btn-secondary" onClick={() => handleAnswer(4)} style={{ backgroundColor: '#8BC1F7', color: 'white' }}>
                    あてはまる
                </button>
                <button className="btn-secondary" onClick={() => handleAnswer(3)}>
                    どちらともいえない
                </button>
                <button className="btn-secondary" onClick={() => handleAnswer(2)}>
                    あてはまらない
                </button>
                <button className="btn-secondary" onClick={() => handleAnswer(1)}>
                    全くあてはまらない
                </button>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <button
                    onClick={handleBack}
                    style={{ background: 'none', border: 'none', color: '#999', textDecoration: 'underline', fontSize: '0.9rem' }}
                >
                    前に戻る
                </button>
            </div>
        </div>
    );
};
