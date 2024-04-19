import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: JSON.parse(localStorage.getItem("cart"))
      ? JSON.parse(localStorage.getItem("cart"))
      : [],
    totalItems: JSON.parse(localStorage.getItem("totalItems"))
      ? JSON.parse(localStorage.getItem("totalItems"))
      : 0,
    total: JSON.parse(localStorage.getItem("total"))
      ? JSON.parse(localStorage.getItem("total"))
      : 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload;
      const index = state.cart.findIndex((item) => item._id === course._id);

      if (index >= 0) {
        toast.error("Course already in cart");
        return;
      }

      state.cart.push(course);
      state.totalItems++;
      state.total += course.price;

      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

      toast.success("Course added to the cart");
    },

    removeFromCart: (state, action) => {
      const course = action.payload;
      const index = state.cart.findIndex((item) => item._id === course._id);

      if (index >= 0) {
        state.cart.splice(index, 1);
        state.totalItems--;
        state.total -= state.cart[index].price;

        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

        toast.success("Course removed successfully");
      }
    },

    resetCart: (state) => {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;
      // Update to localstorage
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
    },
  },
});

export default cartSlice.reducer;
export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
