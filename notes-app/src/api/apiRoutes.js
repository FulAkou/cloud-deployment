import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const getNotes = () => axios.get(`${API_BASE_URL}/notes`);

export const updateNote = (id, updatedNote) =>
  axios.put(`${API_BASE_URL}/note/${id}`, updatedNote);

export const deleteNote = (id) => axios.delete(`${API_BASE_URL}/note/${id}`);

export const addNote = (newNote) => axios.post(`${API_BASE_URL}/note`, newNote);
