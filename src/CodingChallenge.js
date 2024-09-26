import React, { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';
import ReactMarkdown from 'react-markdown';
import ChallengeFailed from './ChallengeFailed';
import ChallengeCompleted from './ChallengeCompleted';
import LoadingAnimation from './LoadingAnimation';

const CodingChallenge = ({ onComplete, onBackToSelection, user }) => {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [instructions, setInstructions] = useState('Loading...');
    const [examples, setExamples] = useState([]);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasLost, setHasLost] = useState(false);
    const [challengeTime, setChallengeTime] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [score, setScore] = useState(null);
    const [allTestsPassed, setAllTestsPassed] = useState(false);
    const hasFetchedExercise = useRef(false);
    const startTime = useRef(null);
    const submitButtonRef = useRef(null);

    useEffect(() => {
        if (!user || !user.name) {
            onBackToSelection();
        }
    }, [user, onBackToSelection]);

    useEffect(() => {
        const fetchExercise = async () => {
            if (hasFetchedExercise.current) return;
            hasFetchedExercise.current = true;

            try {
                const response = await fetch('https://tpm28.tech/exercise');
                const data = await response.json();
                setCode(data.starter_code);
                setInstructions(data.exercise);
                setExamples(data.examples.examples);
                const challengeTimeInSeconds = parseInt(data.challenge_time) * 60;
                setChallengeTime(challengeTimeInSeconds);
                setTimeLeft(challengeTimeInSeconds);
                setIsLoading(false);
                startTime.current = Date.now();
            } catch (error) {
                console.error('Error fetching exercise:', error);
                setIsLoading(false);
            }
        };

        fetchExercise();
    }, []);

    useEffect(() => {
        let timerId;
        if (timeLeft > 0) {
            timerId = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setHasLost(true);
        }
        return () => clearTimeout(timerId);
    }, [timeLeft]);

    const clearOutput = () => {
        setOutput('');
    };

    const testCode = async () => {
        clearOutput();

        const requestBody = {
            code: code,
            tests: examples.map(example => ({
                input: example.input,
                output: example.output
            }))
        };

        try {
            const response = await fetch('https://tpm28.tech/exercise/tests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.body) {
                throw new Error('No response body');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let outputText = '';
            let correctTests = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                lines.forEach(line => {
                    if (line.startsWith('data:')) {
                        const data = JSON.parse(line.replace('data: ', ''));
                        const testIndex = outputText.split('-->').length;
                        const testResult = `--> TEST ${testIndex}\ninput: ${data.input}\nexpected output: ${data.expected_output}\noutput: ${data.actual_output}\n${data.is_correct ? 'CORRECT' : 'WRONG'}\n\n`;
                        outputText += testResult;
                        setOutput(prevOutput => prevOutput + testResult);
                        if (data.is_correct) {
                            correctTests++;
                        }
                    }
                });
            }

            setAllTestsPassed(correctTests === 5);
            if (correctTests === 5) {
                flashSubmitButton();
            }
        } catch (error) {
            console.error('Error testing code:', error);
            setOutput('Error testing code');
        }
    };

    const flashSubmitButton = () => {
        if (submitButtonRef.current) {
            submitButtonRef.current.style.animation = 'flash-green 1s infinite';
        }
    };

    const submitCode = async () => {
        if (!allTestsPassed) return;

        const endTime = Date.now();
        const timeSpent = Math.floor((endTime - startTime.current) / 1000);

        const username = user && user.name ? user.name : 'Anonymous';

        const requestBody = {
            username: username,
            consigne: instructions,
            code: code,
            temps_code: timeSpent
        };

        try {
            const response = await fetch('https://tpm28.tech/exercise/eval', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            setScore(data.score);
            setIsCompleted(true);
            onComplete(data.score);
        } catch (error) {
            console.error('Error submitting code:', error);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleBackToSelection = () => {
        onBackToSelection();
    };

    const markdownStyles = {
        fontSize: '1em',
        lineHeight: '1.3',
        '& *': {
            fontSize: 'inherit',
            lineHeight: 'inherit',
        },
        '& p, & ul, & ol': {
            margin: '0.5em 0',
        },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: '0.5em 0 0.2em',
        },
    };

    if (isLoading) {
        return <LoadingAnimation />;
    }

    if (hasLost) {
        return <ChallengeFailed onBackToSelection={onBackToSelection} />;
    }

    if (isCompleted) {
        return (
            <ChallengeCompleted
                score={score}
                onBackToSelection={handleBackToSelection}
            />
        );
    }

    return (
        <div className="coding-challenge">
            <div className="left-panel">
                <div className="exercise-instructions" style={{
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    padding: '10px',
                }}>
                    <ReactMarkdown components={{
                        p: ({ node, ...props }) => <p style={markdownStyles} {...props} />,
                        h1: ({ node, ...props }) => <h1 style={markdownStyles} {...props} />,
                        h2: ({ node, ...props }) => <h2 style={markdownStyles} {...props} />,
                        h3: ({ node, ...props }) => <h3 style={markdownStyles} {...props} />,
                        h4: ({ node, ...props }) => <h4 style={markdownStyles} {...props} />,
                        h5: ({ node, ...props }) => <h5 style={markdownStyles} {...props} />,
                        h6: ({ node, ...props }) => <h6 style={markdownStyles} {...props} />,
                        ul: ({ node, ...props }) => <ul style={{ ...markdownStyles, marginTop: '0.3em', marginBottom: '0.2em' }} {...props} />,
                        ol: ({ node, ...props }) => <ol style={{ ...markdownStyles, marginTop: '0.3em', marginBottom: '0.2em' }} {...props} />,
                        li: ({ node, ...props }) => <li style={markdownStyles} {...props} />,
                    }}>
                        {instructions}
                    </ReactMarkdown>
                </div>
                <div className="output-panel" style={{
                    height: 'calc(100vh - 50vh - 40px)',
                    overflowY: 'auto',
                    padding: '10px',
                }}>
                    <h2>Standard Output</h2>
                    <pre id="output"><code>{output}</code></pre>
                    <div className="btn-container">
                        <button className="btn" onClick={testCode}>Test Code</button>
                        <button
                            ref={submitButtonRef}
                            className="btn"
                            onClick={submitCode}
                            disabled={!allTestsPassed}
                        >
                            Submit
                        </button>
                        <button className="btn" onClick={handleBackToSelection}>Back</button>
                    </div>
                </div>
            </div>
            <div className="right-panel">
                <div className="timer">
                    {timeLeft !== null && `Time remaining: ${formatTime(timeLeft)}`}
                </div>
                <div className="code-editor">
                    <h2>Code Editor</h2>
                    <CodeMirror
                        value={code}
                        height="100%"
                        theme={dracula}
                        extensions={[python()]}
                        onChange={(value) => setCode(value)}
                        style={{ height: 'calc(100vh - 40px)' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CodingChallenge;