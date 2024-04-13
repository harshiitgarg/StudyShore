import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.jsx";
import { endpoints } from "../apis";
import { setLoading, setToken } from "../../slices/authSlice.jsx";
import { setUser } from "../../slices/profileSlice.jsx";

const {
  LOGIN_API,
  SIGNUP_API,
  SENDOTP_API,
  RESET_PASSWORD_TOKEN_API,
  RESET_PASSWORD_API,
} = endpoints;

export const login = (email, password, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      //get the response from the api
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Login Successful");

      //   dispatch the action to set token and user in the redux store
      dispatch(setToken(response.data.data.refreshToken));
      const userImage = response.data.data?.user?.image
        ? response.data.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.user?.firstName} ${response.data.data.user?.lastName}`;
      dispatch(setUser({ ...response.data.data.user, image: userImage }));

      //   set the values of token and user in the localStorage so that it can be used for further purposes
      localStorage.setItem(
        "refreshToken",
        JSON.stringify(response.data.data.refreshToken)
      );
      //   else localStorage.setItem("refreshToken", undefined);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      //    finally navigate after the login to my profile page
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

export const sendOtp = (email, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
      });
      console.log("SENDOTP API RESPONSE............", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP sent successfully");
      navigate("/verify-email");
    } catch (error) {
      console.log("SENDOTP API ERROR............", error);
      toast.error("Could Not Send OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

export const signup = (
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      console.log("SIGNUP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup Successful");
      navigate("/login");
    } catch (error) {
      console.log("SIGNUP API ERROR............", error);
      toast.error("Could Not Register User");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

export const logout = (navigate) => {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };
};

export const getPasswordResetToken = (email, setEmailSent) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESET_PASSWORD_TOKEN_API, {
        email,
      });
      console.log("RESET PASSWORD TOKEN RESPONSE....", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Failed to send email for resetting password");
    }
    dispatch(setLoading(false));
  };
};

export const resetPassword = (password, confirmPassword, token, navigate) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESET_PASSWORD_API, {
        password,
        confirmPassword,
        token,
      });
      console.log("RESET PASSWORD RESPONSE....", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Password has been reset successfully");
    } catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Failed to reset the password");
    }
    dispatch(setLoading(false));
    navigate("/login");
  };
};
