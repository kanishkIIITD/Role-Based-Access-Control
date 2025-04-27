import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all users
export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/auth/users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/auth/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// Verify user
export const verifyUser = async (userId) => {
  const response = await axios.put(
    `${API_URL}/auth/users/${userId}/verify`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};

// Update user role
export const updateUserRole = async (userId, role) => {
  const response = await axios.put(
    `${API_URL}/auth/users/${userId}/role`,
    { role },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
}; 