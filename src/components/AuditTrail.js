import React, { useState, useEffect } from 'react';
import { fetchAuditTrail } from '../services/api';

function AuditTrail() {
  const [auditTrail, setAuditTrail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0], // Default to last 7 days
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAuditData();
  }, [dateFilter]);

  const fetchAuditData = async () => {
    setLoading(true);
    try {
      const auditData = await fetchAuditTrail(dateFilter.startDate, dateFilter.endDate);
      setAuditTrail(auditData);
    } catch (error) {
      console.error('Error fetching audit trail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateFilter({
      ...dateFilter,
      [name]: value
    });
  };

  return (
    <div className="audit-trail">
      <h2>Audit Trail</h2>
      
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
            />
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading audit trail...</div>
      ) : auditTrail.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Number</th>
              <th>Action</th>
              <th>Status</th>
              <th>Timestamp</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {auditTrail.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.studentNumber}</td>
                <td>{entry.action}</td>
                <td className={`status-${entry.status.toLowerCase()}`}>{entry.status}</td>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
                <td>{entry.details || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No audit entries found for the selected period.</p>
      )}
    </div>
  );
}

export default AuditTrail;