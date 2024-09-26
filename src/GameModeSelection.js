import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Leaderboard from './Leaderboard';
import CodingChallenge from './CodingChallenge';

const GameModeSelection = ({ setGameMode, gameMode, user, onLogout, onLogin, onBackToSelection }) => {
    const [totalScore, setTotalScore] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.name && user.name !== 'Example') {
                try {
                    const response = await fetch(`https://tpm28.tech/exercise/user/${user.name}`);
                    const data = await response.json();
                    setTotalScore(data.total_score);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [user]);

    const handleBackToHome = () => {
        console.log("Returning to game mode selection");
        onBackToSelection();
    };


    const handleSingleplayerClick = () => {
        navigate('/singleplayer');
    };

    return (
        <>
            <div className="header">
                <div className="user-info">
                    {user ? (
                        <>
                            {user.picture ? (
                                <img src={user.picture} alt="User Avatar" className="user-avatar" />
                            ) : (
                                <div className="default-avatar">?</div>
                            )}
                            <span className="user-name">{user.name}</span>
                            {totalScore !== null && <span className="user-score">XP: {totalScore}</span>}
                        </>
                    ) : (
                        <span>Loading user...</span>
                    )}
                </div>
                {user && user.name === 'Example' ? (
                    <button className="btn" onClick={onLogin}>Login with Discord</button>
                ) : (
                    <button className="btn" onClick={onLogout}>Logout</button>
                )}
            </div>
            <div className="container">
                {gameMode === 'leaderboard' ? (
                    <Leaderboard onBackToHome={handleBackToHome} />
                ) : (
                    <>
                        <div className="container">
                            {gameMode === 'leaderboard' ? (
                                <Leaderboard onBackToHome={handleBackToHome} />
                            ) : gameMode === 'singleplayer' ? (
                                <CodingChallenge user={user} onBackToSelection={handleBackToHome} />
                            ) : (
                                <>
                                    <h1>Select Game Mode</h1>
                                    <div className="btn-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <button className="btn" onClick={handleSingleplayerClick}>Singleplayer</button>
                                        <button className="btn" disabled>Multiplayer (when we have time)</button>
                                        <button className="btn" onClick={() => setGameMode('leaderboard')}>Leaderboard</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default GameModeSelection;