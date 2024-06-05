import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice.jsx";
import profileSlice from "../slices/profileSlice.jsx";
import cartSlice from "../slices/cartSlice.jsx";
import courseSlice from "../slices/courseSlice.jsx";
import viewCourseSlice from "../slices/viewCourseSlice.jsx";
const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: profileSlice,
    cart: cartSlice,
    course: courseSlice,
    viewCourse: viewCourseSlice,
  },
});

export default store;
