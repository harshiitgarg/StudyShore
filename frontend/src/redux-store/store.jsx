import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice.jsx";
import profileSlice from "../slices/profileSlice.jsx";
import cartSlice from "../slices/cartSlice.jsx";
const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: profileSlice,
    cart: cartSlice,
  },
});

export default store;
