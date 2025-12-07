import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizzes: [],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, { payload: quizzes }) => {
      state.quizzes = quizzes;
    },
    addQuiz: (state, { payload: quiz }) => {
      state.quizzes = [...state.quizzes, quiz] as any;
    },
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = (state.quizzes as any[]).map((q: any) =>
        q._id === quiz._id ? quiz : q
      ) as any;
    },
    deleteQuiz: (state, { payload: quizId }) => {
      state.quizzes = (state.quizzes as any[]).filter(
        (q: any) => q._id !== quizId
      ) as any;
    },
  },
});

export const { setQuizzes, addQuiz, updateQuiz, deleteQuiz } =
  quizzesSlice.actions;
export default quizzesSlice.reducer;
