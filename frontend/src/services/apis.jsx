const BASE_URL = "http://localhost:8000/api/v1";

export const categories = {
  CATEGORIES_API: BASE_URL + "/category/showAllCategories",
};

export const endpoints = {
  LOGIN_API: BASE_URL + "/users/login",
  SIGNUP_API: BASE_URL + "/users/signup",
  SENDOTP_API: BASE_URL + "/users/sendOtp",
  RESET_PASSWORD_TOKEN_API: BASE_URL + "/users/reset-password-token",
  RESET_PASSWORD_API: BASE_URL + "/users/reset-password",
};
