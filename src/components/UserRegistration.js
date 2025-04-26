import React, { useState, useEffect } from 'react';
import { registerUser, getRegisteredUsers } from '../services/api';
import '../styles/UserRegistration.css';
function UserRegistration() {
  const [formData, setFormData] = useState({
    studentNumber: '',
    firstName: '',
    lastName: ''
  });

  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [messageType, setMessageType] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    (async () => {
      await fetchUsers();
    })();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setMessage('');

    try {
      const users = await getRegisteredUsers();
      setRegisteredUsers(Array.isArray(users) ? users : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage(`Failed to load users. ${error.message}`);
      setMessageType('error');
      setDebugInfo({
        action: 'fetchUsers',
        error: error.toString(),
        time: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { studentNumber, firstName, lastName } = formData;

    if (!/^C\d+$/.test(studentNumber.trim())) {
      setMessage('Invalid student number format. Must start with "C" followed by numbers only.');
      setMessageType('error');
      return false;
    }

    if (!firstName.trim()) {
      setMessage('First name is required.');
      setMessageType('error');
      return false;
    }

    if (!lastName.trim()) {
      setMessage('Last name is required.');
      setMessageType('error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!validateForm()) return;

    setApiLoading(true);
    try {
      const response = await registerUser(formData);
      setMessage('User registered successfully!');
      setMessageType('success');

      setFormData({
        studentNumber: '',
        firstName: '',
        lastName: ''
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error registering user:', error);

      if (error.message?.includes('already exists')) {
        setMessage('This student number is already registered.');
      } else if (error.message?.includes('network')) {
        setMessage('Network error. Please check your connection and try again.');
      } else {
        setMessage(`Failed to register user: ${error.message || 'Unknown error'}`);
      }

      setMessageType('error');
      setDebugInfo({
        action: 'registerUser',
        data: formData,
        error: error.toString(),
        time: new Date().toISOString()
      });
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="user-registration">
      <h2>Register New User</h2>

      {message && (
        <div className={`message ${messageType}`} role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="registration-form" autoComplete="off">
        <div className="form-group">
          <label htmlFor="studentNumber">Student Number:</label>
          <input
            type="text"
            id="studentNumber"
            name="studentNumber"
            value={formData.studentNumber}
            onChange={handleChange}
            placeholder="e.g., C12345"
            required
          />
          <small>Must start with 'C' followed by numbers only.</small>
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
        </div>

        <button type="submit" disabled={apiLoading}>
          {apiLoading ? 'Registering...' : 'Register User'}
        </button>
      </form>

      {debugInfo && (
        <div className="debug-info">
          <h4>Debug Information</h4>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}

      <div className="registered-users-section">
        <h3>Registered Users</h3>
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : registeredUsers.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Number</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {registeredUsers.map((user) => (
                <tr key={user.studentNumber}>
                  <td>{user.studentNumber}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    {user.registrationDate
                      ? new Date(user.registrationDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No registered users found.</p>
        )}
      </div>
    </div>
  );
}

export default UserRegistration;
