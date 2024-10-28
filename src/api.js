import axios from 'axios';

// Base URL of the Notes API
const API_BASE_URL = 'http://localhost:8080';  // adjust if needed

// Set the authorization token
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer <token>`,  // Replace `<token>` with the actual token or use a dynamic auth token method
  },
});

export const getNotes = async (page = 0, size = 10, sort = 'createdAt', direction = 'asc') => {
  const response = await axios.get(`${API_BASE_URL}/notes`, {
    params: { page, size, sort, direction },
    ...getAuthHeaders(),
  });
  return response.data;
};

export const getNote = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/notes/${id}`, getAuthHeaders());
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await axios.post(`${API_BASE_URL}/notes`, noteData, getAuthHeaders());
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await axios.put(`${API_BASE_URL}/notes/${id}`, noteData, getAuthHeaders());
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/notes/${id}`, getAuthHeaders());
  return response.status;
};
