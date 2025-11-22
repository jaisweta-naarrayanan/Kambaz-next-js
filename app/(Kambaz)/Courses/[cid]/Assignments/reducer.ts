import { createSlice } from "@reduxjs/toolkit";
import { assignments } from "@/app/(Kambaz)/Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  assignments: assignments,
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, { payload: assignments }) => {
      state.assignments = assignments;
    },
  },
});

export const { setAssignments } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
