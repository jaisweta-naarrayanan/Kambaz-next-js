import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  attempts: [],
};

const quizAttemptsSlice = createSlice({
  name: "quizAttempts",
  initialState,
  reducers: {
    setAttempts: (state, { payload: attempts }) => {
      state.attempts = attempts;
    },
    addAttempt: (state, { payload: attempt }) => {
      state.attempts = [...state.attempts, attempt] as any;
    },
  },
});

export const { setAttempts, addAttempt } = quizAttemptsSlice.actions;
export default quizAttemptsSlice.reducer;
