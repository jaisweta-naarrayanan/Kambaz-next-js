import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_HTTP_SERVER + "/api" || "http://localhost:4000/api";

export const getAssignmentsForCourse = async (courseId: string) => {
  const response = await axios.get(`${API_BASE}/courses/${courseId}/assignments`, { withCredentials: true });
  return response.data;
};

export const createAssignment = async (courseId: string, assignment: any) => {
  const response = await axios.post(
    `${API_BASE}/courses/${courseId}/assignments`,
    assignment,
    { withCredentials: true }
  );
  return response.data;
};

export const updateAssignment = async (courseId: string, assignment: any) => {
  const response = await axios.put(
    `${API_BASE}/courses/${courseId}/assignments/${assignment._id}`,
    assignment,
    { withCredentials: true }
  );
  return response.data;
};

export const deleteAssignment = async (courseId: string, assignmentId: string) => {
  const response = await axios.delete(
    `${API_BASE}/courses/${courseId}/assignments/${assignmentId}`,
    { withCredentials: true }
  );
  return response.data;
};
