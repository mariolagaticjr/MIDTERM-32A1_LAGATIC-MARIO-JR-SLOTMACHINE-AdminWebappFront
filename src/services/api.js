const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7190';

/**
 * 
 * @param {string} url - 
 * @param {object} options 
 * @returns {Promise<any>} 
 */
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, options).catch(error => {
      console.error(`Network error connecting to ${url}:`, error);
      throw new Error(`Network error: Could not connect to server. Please check if the API server is running.`);
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || `Server error: ${response.status}`;
      } catch (e) {
        errorMessage = `HTTP error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`API error with ${url}:`, error);
    throw error;
  }
};

/**
 * 
 * @param {object} userData 
 * @returns {Promise<any>} 
 */
export const registerUser = async (userData) => {
  const requiredFields = ['studentNumber', 'firstName', 'lastName'];
  for (const field of requiredFields) {
    if (!userData[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (!/^C\d+$/.test(userData.studentNumber)) {
    throw new Error('Student number must start with C followed by digits');
  }

  const userDataWithDate = {
    ...userData,
    registrationDate: userData.registrationDate || new Date().toISOString()
  };

  try {
    return await fetchWithErrorHandling(`${API_BASE_URL}/api/register-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDataWithDate),
      signal: AbortSignal.timeout(20000) 
    });
  } catch (error) {
    console.error('Registration error details:', error);

    if (error.message.includes('500')) {
      throw new Error('Registration failed: The server encountered an internal error. Please try again later or contact support if the issue persists.');
    }

    throw error;
  }
};

/**
 * 
 * @returns {Promise<any>} 
 */
export const getRegisteredUsers = async () => {
  return fetchWithErrorHandling(`${API_BASE_URL}/api/users`);
};

/**
 * 
 * @param {string} endpoint 
 * @param {string} startDate 
 * @param {string} endDate 
 * @returns {Promise<any>} 
 */
export const fetchGames = async (endpoint, startDate = '', endDate = '') => {
  const cleanEndpoint = endpoint.replace(/^\/?(api\/)?/, '');
  
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const url = `${API_BASE_URL}/api/${cleanEndpoint}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  return fetchWithErrorHandling(url);
};

/**
 * 
 * @returns {Promise<any>} 
 */
export const fetchRecentPlayers = async () => {
  return fetchWithErrorHandling(`${API_BASE_URL}/api/recent-players`);
};

/**
 * Fetch game statistics
 * @returns {Promise<any>} - Game statistics
 */
export const fetchGameStats = async () => {
  return fetchWithErrorHandling(`${API_BASE_URL}/api/stats`);
};

/**
 *
 * @param {string} startDate 
 * @param {string} endDate 
 * @returns {Promise<any>} 
 */
export const fetchAuditTrail = async (startDate = '', endDate = '') => {
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const url = `${API_BASE_URL}/api/audit?${queryParams.toString()}`;
  return fetchWithErrorHandling(url);
};

/**
 * 
 * @param {string} studentNumber 
 * @returns {Promise<any>} 
 */
export const validatePlayer = async (studentNumber) => {
  if (!studentNumber) {
    throw new Error('Student number is required');
  }

  return fetchWithErrorHandling(`${API_BASE_URL}/api/validate-player?studentNumber=${encodeURIComponent(studentNumber)}`);
};

/**
 
 * @param {object} gameData 
 * @returns {Promise<any>} 
 */
export const saveGame = async (gameData) => {
  return fetchWithErrorHandling(`${API_BASE_URL}/api/save-game`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData)
  });
};