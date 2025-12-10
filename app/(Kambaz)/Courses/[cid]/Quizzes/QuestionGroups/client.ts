import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_HTTP_SERVER + "/api" || "http://localhost:4000/api";

export const getGroupsForQuiz = async (quizId: string) => {
  const response = await axios.get(`${API_BASE}/quizzes/${quizId}/groups`, { withCredentials: true });
  return response.data;
};

export const createGroup = async (quizId: string, group: any) => {
  const response = await axios.post(
    `${API_BASE}/quizzes/${quizId}/groups`,
    group,
    { withCredentials: true }
  );
  return response.data;
};

export const updateGroup = async (quizId: string, groupId: string, group: any) => {
  const response = await axios.put(
    `${API_BASE}/quizzes/${quizId}/groups/${groupId}`,
    group,
    { withCredentials: true }
  );
  return response.data;
};

export const deleteGroup = async (quizId: string, groupId: string) => {
  const response = await axios.delete(
    `${API_BASE}/quizzes/${quizId}/groups/${groupId}`,
    { withCredentials: true }
  );
  return response.data;
};
