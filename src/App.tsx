import { useState, useEffect } from 'react';
import { Screen, Answers } from './types';
import questionData from './data/questions.json';
import { StartScreen } from './components/StartScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ResultScreen } from './components/ResultScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { parseShareUrl } from './lib/share';

function App() {
    const [screen, setScreen] = useState<Screen>('start');
    const [answers, setAnswers] = useState<Answers>({});

    useEffect(() => {
        // Check for shared URL hash
        const sharedAnswers = parseShareUrl();
        if (sharedAnswers) {
            setAnswers(sharedAnswers);
            setScreen('result');
            // Clean URL hash without reload
            window.history.replaceState(null, '', window.location.pathname);
        }
    }, []);

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

    // History Handlers
    const handleShowHistory = () => {
        setScreen('history');
    };

    const handleLoadSave = (loadedAns: Answers) => {
        setAnswers(loadedAns);
        setScreen('result');
    };

    return (
        <div className="app-container">
            {screen === 'start' && (
                <StartScreen
                    onStart={handleStart}
                    onShowHistory={handleShowHistory}
                />
            )}
            {screen === 'history' && (
                <HistoryScreen
                    onLoad={handleLoadSave}
                    onBack={handleBackToStart}
                />
            )}
            {screen === 'question' && (
                <QuestionScreen
                    questions={questionData}
                    onAnswer={handleAnswer}
                    onBack={handleBackToStart}
                    onFinish={handleFinish}
                />
            )}
            {screen === 'result' && (
                <ResultScreen
                    answers={answers}
                    onReset={handleBackToStart}
                />
            )}
        </div>
    );
}

export default App;
