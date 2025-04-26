// App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UserRegistration from './components/UserRegistration';
import GameResults from './components/GameResults';
import AuditTrail from './components/AuditTrail';
import GameStatistics from './components/GameStatistics';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Slot Machine Game Admin</h1>
          <nav className="main-nav">
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/register">Register Users</Link></li>
              <li><Link to="/results">Game Results</Link></li>
              <li><Link to="/audit">Audit Trail</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/results" element={<GameResults />} />
            <Route path="/audit" element={<AuditTrail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;