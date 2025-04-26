import React, { useState, useEffect } from 'react';
import { fetchGameStats } from '../services/api';

const GameStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchGameStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load game statistics:', err);
        setError('Failed to load game statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Game Statistics</h2>
        <div className="flex justify-center">
          <div className="animate-pulse">Loading statistics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Game Statistics</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Game Statistics</h2>
      
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Total Games</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalGames || 0}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Total Players</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalPlayers || 0}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Average Score</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.averageScore ? stats.averageScore.toFixed(2) : '0.00'}
            </p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">Highest Score</h3>
            <p className="text-3xl font-bold text-amber-600">{stats.highestScore || 0}</p>
          </div>
        </div>
      ) : (
        <p>No statistics available</p>
      )}
    </div>
  );
};

export default GameStatistics;