import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token:
      localStorage.getItem("refreshToken") !== "undefined"
        ? JSON.parse(localStorage.getItem("refreshToken"))
        : null,
    loading: false,
    signupData: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSignupData: (state, action) => {
      state.signupData = action.payload;
    },
  },
});

export default authSlice.reducer;
export const { setToken, setLoading, setSignupData } = authSlice.actions;
