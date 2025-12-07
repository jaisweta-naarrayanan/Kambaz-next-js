import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_HTTP_SERVER + "/api" || "http://localhost:4000/api";

export const getAttemptsForStudent = async (quizId: string) => {
  const response = await axios.get(`${API_BASE}/quizzes/${quizId}/attempts`, { withCredentials: true });
  return response.data;
};

export const getAttemptById = async (quizId: string, attemptId: string) => {
  const response = await axios.get(`${API_BASE}/quizzes/${quizId}/attempts/${attemptId}`, { withCredentials: true });
  return response.data;
};

export const submitQuizAttempt = async (quizId: string, attempt: any) => {
  const response = await axios.post(
    `${API_BASE}/quizzes/${quizId}/attempts`,
    attempt,
    { withCredentials: true }
  );
  return response.data;
};
