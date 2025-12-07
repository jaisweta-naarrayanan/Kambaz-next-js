import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_HTTP_SERVER + "/api" || "http://localhost:4000/api";

export const getQuizzesForCourse = async (courseId: string) => {
  const response = await axios.get(`${API_BASE}/courses/${courseId}/quizzes`, { withCredentials: true });
  return response.data;
};

export const getQuizById = async (courseId: string, quizId: string) => {
  const response = await axios.get(`${API_BASE}/courses/${courseId}/quizzes/${quizId}`, { withCredentials: true });
  return response.data;
};

export const createQuiz = async (courseId: string, quiz: any) => {
  const response = await axios.post(
    `${API_BASE}/courses/${courseId}/quizzes`,
    quiz,
    { withCredentials: true }
  );
  return response.data;
};

export const updateQuiz = async (courseId: string, quiz: any) => {
  const response = await axios.put(
    `${API_BASE}/courses/${courseId}/quizzes/${quiz._id}`,
    quiz,
    { withCredentials: true }
  );
  return response.data;
};

export const deleteQuiz = async (courseId: string, quizId: string) => {
  const response = await axios.delete(
    `${API_BASE}/courses/${courseId}/quizzes/${quizId}`,
    { withCredentials: true }
  );
  return response.data;
};

export const publishQuiz = async (courseId: string, quizId: string, published: boolean) => {
  const response = await axios.put(
    `${API_BASE}/courses/${courseId}/quizzes/${quizId}/publish`,
    { published },
    { withCredentials: true }
  );
  return response.data;
};
