import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    totalItems: 0,
  },
  reducers: {
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
    },
  },
});

export default cartSlice.reducer;
export const { setTotalItems } = cartSlice.actions;
