import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_HTTP_SERVER + "/api" || "http://localhost:4000/api";

export const getQuestionsForQuiz = async (quizId: string) => {
  const response = await axios.get(`${API_BASE}/quizzes/${quizId}/questions`, { withCredentials: true });
  return response.data;
};

export const createQuestion = async (quizId: string, question: any) => {
  const response = await axios.post(
    `${API_BASE}/quizzes/${quizId}/questions`,
    question,
    { withCredentials: true }
  );
  return response.data;
};

export const updateQuestion = async (quizId: string, question: any) => {
  const response = await axios.put(
    `${API_BASE}/quizzes/${quizId}/questions/${question._id}`,
    question,
    { withCredentials: true }
  );
  return response.data;
};

export const deleteQuestion = async (quizId: string, questionId: string) => {
  const response = await axios.delete(
    `${API_BASE}/quizzes/${quizId}/questions/${questionId}`,
    { withCredentials: true }
  );
  return response.data;
};
