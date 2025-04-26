import React, { useState, useEffect, useCallback } from 'react';
import { fetchGames } from '../services/api';
import '../styles/GameResult.css';
function GameResults() {
  const [gameResults, setGameResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0], // Default to last 7 days
    endDate: new Date().toISOString().split('T')[0]
  });
  const [showWinnersOnly, setShowWinnersOnly] = useState(false);

 
  const fetchGameData = useCallback(async () => {
    if (!validateDateRange()) {
      return; 
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = showWinnersOnly ? 'winners' : 'games';
      const results = await fetchGames(endpoint, dateFilter.startDate, dateFilter.endDate);
      
      setGameResults(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Error fetching game results:', error);
      setError(error.message || 'Failed to load game results. Please try again later.');
      setGameResults([]);
    } finally {
      setLoading(false);
    }
  }, [dateFilter.startDate, dateFilter.endDate, showWinnersOnly]);

  const validateDateRange = () => {
    const start = new Date(dateFilter.startDate);
    const end = new Date(dateFilter.endDate);
    return start <= end;
  };

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prevFilter => ({
      ...prevFilter,
      [name]: value
    }));
  };

  const handleRefresh = () => {
    fetchGameData();
  };

  const toggleWinnersOnly = () => {
    setShowWinnersOnly(prevValue => !prevValue);
  };

  return (
    <div className="game-results">
      <h2>Game Results</h2>
      
      <div className="filters">
        <div className="date-filters">
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={dateFilter.startDate}
              onChange={handleDateChange}
              max={dateFilter.endDate}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={dateFilter.endDate}
              onChange={handleDateChange}
              min={dateFilter.startDate}
            />
          </div>
        </div>
        
        <div className="checkbox-filter">
          <label>
            <input
              type="checkbox"
              checked={showWinnersOnly}
              onChange={toggleWinnersOnly}
            />
            Show Winners Only
          </label>
        </div>
        
        <button 
          className="refresh-button"
          onClick={handleRefresh}
          disabled={!validateDateRange() || loading}
        >
          Refresh Data
        </button>
      </div>
      
      {!validateDateRange() && (
        <div className="error-message">
          Start date must be before or equal to end date.
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading game results...</div>
      ) : error ? (
        <div className="error-message">
          {error}
          <button 
            className="retry-button" 
            onClick={handleRefresh}
          >
            Try Again
          </button>
        </div>
      ) : gameResults.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Number</th>
              <th>Name</th>
              <th>Result</th>
              <th>Retries</th>
              <th>Date Played</th>
            </tr>
          </thead>
          <tbody>
            {gameResults.map((game) => (
              <tr key={game.id || `${game.studentNumber}-${game.datePlayed}`} className={game.result === 'win' ? 'winner-row' : ''}>
                <td>{game.studentNumber}</td>
                <td>{game.studentName}</td>
                <td>{game.result}</td>
                <td>{game.retryCount}</td>
                <td>{new Date(game.datePlayed).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-results">
          <p>No game results found for the selected period.</p>
          <button 
            className="refresh-button" 
            onClick={handleRefresh}
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}

export default GameResults;