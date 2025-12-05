import axios from "axios";
const API_BASE = process.env.NEXT_PUBLIC_HTTP_SERVER + "/api" || "http://localhost:4000/api";

export const getAllUsers = async () => {
  const response = await axios.get(`${API_BASE}/users`, { withCredentials: true });
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await axios.get(`${API_BASE}/users/${userId}`, { withCredentials: true });
  return response.data;
};

export const createUser = async (user: any) => {
  const response = await axios.post(`${API_BASE}/users`, user, { withCredentials: true });
  return response.data;
};

export const updateUser = async (userId: string, user: any) => {
  const response = await axios.put(`${API_BASE}/users/${userId}`, user, { withCredentials: true });
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`${API_BASE}/users/${userId}`, { withCredentials: true });
  return response.data;
};

export const getUsersForCourse = async (courseId: string) => {
  const response = await axios.get(`${API_BASE}/courses/${courseId}/users`, { withCredentials: true });
  return response.data;
};
