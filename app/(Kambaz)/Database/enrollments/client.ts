import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

export const enrollUserInCourse = async (userId: string, courseId: string) => {
  const response = await axios.post(`${API_BASE}/enrollments`, { userId, courseId }, { withCredentials: true });
  return response.data;
};

export const unenrollUserFromCourse = async (userId: string, courseId: string) => {
  const response = await axios.delete(`${API_BASE}/enrollments`, { data: { userId, courseId }, withCredentials: true });
  return response.data;
};

export const getEnrollmentsForUser = async (userId: string) => {
  const response = await axios.get(`${API_BASE}/enrollments/user/${userId}`, { withCredentials: true });
  return response.data;
};

export const getEnrollmentsForCourse = async (courseId: string) => {
  const response = await axios.get(`${API_BASE}/enrollments/course/${courseId}`, { withCredentials: true });
  return response.data;
};
