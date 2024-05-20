import axios from 'axios';

const BASE_URL = 'http://localhost:5000'; // Replace with your backend server URL

// Function to make a POST request to verify a code
export const verifyCode = async (token) => {
  try {
    const response = await axios.post(`${BASE_URL}/verify`, { token });
    return response.data;
  } catch (error) {
    throw new Error('Verification failed. Unable to verify code.');
  }
};

// Function to make a POST request to log in a user
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error('Authentication failed. Invalid username or password.');
  }
};

// Function to fetch user data
export const fetchUserData = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user data.');
  }
};

// Function to make a POST request to log out a user (if needed)
export const logout = async () => {
  try {
    // Perform logout logic here (if applicable)
  } catch (error) {
    throw new Error('Logout failed. Unable to log out user.');
  }
};