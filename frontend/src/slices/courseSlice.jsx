import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  initialState: {
    step: 1,
    course: null,
    editCourse: false,
    paymentLoading: false,
  },
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setCourse: (state, action) => {
      state.course = action.payload;
    },
    setEditCourse: (state, action) => {
      state.editCourse = action.payload;
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload;
    },
  },
});

export default courseSlice.reducer;
export const { setCourse, setStep, setEditCourse, setPaymentLoading } =
  courseSlice.actions;
