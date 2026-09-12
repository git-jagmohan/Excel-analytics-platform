import axios from 'axios';

const API_BASE = 'https://excel-analytics-platform-9lmy.onrender.com/api/auth';

export const registerUser = (formData) =>
  axios.post(`${API_BASE}/register`, formData);

export const loginUser = (formData) =>
  axios.post(`${API_BASE}/login`, formData);
