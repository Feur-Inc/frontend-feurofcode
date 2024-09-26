import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import GameModeSelection from './GameModeSelection';
import CodingChallenge from './CodingChallenge';
import ChallengeCompleted from './ChallengeCompleted';
import Leaderboard from './Leaderboard';
import ThemeButton from './ThemeButton';
import Callback from './Callback';
import './styles.css';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [gameMode, setGameMode] = useState(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('discord_token');
    const tokenType = localStorage.getItem('token_type');
    if (token && tokenType) {
      fetchDiscordUser(token, tokenType);
    }
  }, []);

  const fetchDiscordUser = async (accessToken, tokenType) => {
    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${tokenType} ${accessToken}`,
        },
      });
      const data = await response.json();
      setUser({
        name: data.username,
        picture: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
      });
    } catch (error) {
      console.error('Error fetching Discord user:', error);
    }
  };

  const handleLogin = () => {
    window.location.href = 'https://discord.com/oauth2/authorize?client_id=1284116002485047428&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Ffeurofcode%2Fcallback&scope=identify';
  };

  const handleLogout = () => {
    setUser(null);
    setGameMode(null);
    localStorage.removeItem('discord_token');
    localStorage.removeItem('token_type');
  };

  const handleComplete = (finalScore) => {
    setScore(finalScore);
    setChallengeCompleted(true);
  };

  const handleBackToSelection = () => {
    setGameMode(null);
    setChallengeCompleted(false);
    navigate('/');
  };

  const handleLeaderboardClick = () => {
    setGameMode('leaderboard');
    navigate('/leaderboard');
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={
          user ? (
            gameMode === 'leaderboard' ? (
              <Leaderboard onBackToSelection={handleBackToSelection} />
            ) : (
              <GameModeSelection
                setGameMode={setGameMode}
                gameMode={gameMode}
                user={user}
                onLogout={handleLogout}
                onBackToSelection={handleBackToSelection}
              />
            )
          ) : (
            <div className="welcome-container">
              <h1>Welcome to FeurOfCode</h1>
              <p>Discover the world of coding, enhance your skills, and participate in exciting coding competitions. Join our community of passionate developers today!</p>
              <div className="btn-container">
                <button className="btn" onClick={handleLogin}>Sign Up / Log (Discord)</button>
                <button className="btn" onClick={handleLeaderboardClick}>Leaderboard</button>
              </div>
            </div>
          )
        } />
        <Route path="/callback" element={<Callback setUser={setUser} />} />
        <Route path="/singleplayer" element={
          challengeCompleted ? (
            <ChallengeCompleted score={score} onBackToSelection={handleBackToSelection} />
          ) : (
            <CodingChallenge onComplete={handleComplete} onBackToSelection={handleBackToSelection} user={user} />
          )
        } />
        <Route path="/leaderboard" element={<Leaderboard onBackToSelection={handleBackToSelection} />} />
      </Routes>
      <ThemeButton />
    </div>
  );
}

export default App;