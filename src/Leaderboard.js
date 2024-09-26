import React, { useState, useEffect } from 'react';
import LoadingAnimation from './LoadingAnimation';

const Leaderboard = ({ onBackToSelection }) => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const response = await fetch('https://tpm28.tech/exercise/scores');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const sortedData = data
                    .sort((a, b) => b.total_score - a.total_score)
                    .map((player, index) => ({ ...player, rank: index + 1 }));
                setLeaderboardData(sortedData);
            } catch (error) {
                setError('Failed to fetch leaderboard data');
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboardData();
    }, []);

    if (isLoading) return <LoadingAnimation />;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="parent-container">
            <div className="leaderboard-container">
                <h1>Leaderboard</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((player) => (
                            <tr key={player.username}>
                                <td className="rank">{player.rank}</td>
                                <td>
                                    <img
                                        src={player.image_url || "https://via.placeholder.com/60"}
                                        alt="Profile Image"
                                        className="profile-img"
                                    />
                                </td>
                                <td className="name">{player.username}</td>
                                <td className="score">{player.total_score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="btn-container">
                    <button onClick={onBackToSelection} className="btn">Back to Game Selection</button>
                </div>
            </div>
        </div>
    );
};



export default Leaderboard;