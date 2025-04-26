import React, { useState, useEffect } from 'react';
import { fetchGameStats, fetchRecentPlayers } from '../services/api';
import '../styles/Dashboard.css';
function Dashboard() {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalGames: 0,
    totalWins: 0,
    winRate: 0
  });
  
  const [recentPlayers, setRecentPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsData = await fetchGameStats();
        const recentPlayersData = await fetchRecentPlayers();
        
        setStats(statsData);
        setRecentPlayers(recentPlayersData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Players</h3>
          <div className="stat-value">{stats.totalPlayers}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Games</h3>
          <div className="stat-value">{stats.totalGames}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Wins</h3>
          <div className="stat-value">{stats.totalWins}</div>
        </div>
        
        <div className="stat-card">
          <h3>Win Rate</h3>
          <div className="stat-value">{stats.winRate}%</div>
        </div>
      </div>
      
      <div className="recent-players-section">
        <h3>Recent Players (Last 3 Hours)</h3>
        {recentPlayers && recentPlayers.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Number</th>
                <th>Name</th>
                <th>Time Played</th>
                <th>Can Play Again At</th>
              </tr>
            </thead>
            <tbody>
              {recentPlayers.map((player) => {
                const playedAt = new Date(player.datePlayed);
                const canPlayAgainAt = new Date(playedAt.getTime() + (3 * 60 * 60 * 1000)); // 3 hours later
                
                return (
                  <tr key={player.id || player.studentNumber}>
                    <td>{player.studentNumber}</td>
                    <td>{player.studentName}</td>
                    <td>{playedAt.toLocaleString()}</td>
                    <td>{canPlayAgainAt.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No recent players in the last 3 hours.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;