import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: [],
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestions: (state, { payload: questions }) => {
      state.questions = questions;
    },
    addQuestion: (state, { payload: question }) => {
      state.questions = [...state.questions, question] as any;
    },
    updateQuestion: (state, { payload: question }) => {
      state.questions = (state.questions as any[]).map((q: any) =>
        q._id === question._id ? question : q
      ) as any;
    },
    deleteQuestion: (state, { payload: questionId }) => {
      state.questions = (state.questions as any[]).filter(
        (q: any) => q._id !== questionId
      ) as any;
    },
  },
});

export const { setQuestions, addQuestion, updateQuestion, deleteQuestion } =
  questionsSlice.actions;
export default questionsSlice.reducer;
