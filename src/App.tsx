import { useState } from 'react';
import { Screen, Answers } from './types';
import questionData from './data/questions.json';
import { StartScreen } from './components/StartScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ResultScreen } from './components/ResultScreen';

function App() {
    const [screen, setScreen] = useState<Screen>('start');
    const [answers, setAnswers] = useState<Answers>({});

    const handleStart = () => {
        setAnswers({});
        setScreen('question');
    };

    const handleAnswer = (questionId: string, value: number) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleBackToStart = () => {
        setScreen('start');
    };

    const handleFinish = () => {
        setScreen('result');
    };

    return (
        <div className="app-container">
            {screen === 'start' && <StartScreen onStart={handleStart} />}
            {screen === 'question' && (
                <QuestionScreen
                    questions={questionData}
                    answers={answers}
                    onAnswer={handleAnswer}
                    onBack={handleBackToStart}
                    onFinish={handleFinish}
                />
            )}
            {screen === 'result' && (
                <ResultScreen
                    questions={questionData}
                    answers={answers}
                    onReset={handleBackToStart}
                />
            )}
        </div>
    );
}

export default App;
