import toast from "react-hot-toast";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { settingsEndpoints } from "../apis";
import { setLoading } from "../../slices/profileSlice";
import { logout } from "./authAPI";

const { UPDATE_PROFILE_PICTURE, UPDATE_PROFILE, DELETE_PROFILE } =
  settingsEndpoints;

export const updateProfilePicture = (token, formData) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const res = await apiConnector("PUT", UPDATE_PROFILE_PICTURE, formData, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      });

      //   console.log(token);

      console.log("UPDATE_DISPLAY_PICTURE_API API RESPONSE............", res);
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
      toast.success("Display Picture Updated Successfully");
      dispatch(setUser(res.data.data));
      localStorage.setItem("user", JSON.stringify(res.data.data));
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error);
      toast.error("Could Not Update Display Picture");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

export const updateProfile = (token, formData) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const res = await apiConnector("PUT", UPDATE_PROFILE, formData, {
        Authorization: `Bearer ${token}`,
      });
      console.log(res);
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
      // const userImage = res.data.data.image
      //   ? res.data.data.image
      //   : `https://api.dicebear.com/5.x/initials/svg?seed=${res.data.updatedUserDetails.firstName} ${res.data.updatedUserDetails.lastName}`;
      // dispatch(setUser({ ...res.data.data, image: userImage }));
      dispatch(setUser(res.data.data));
      // localStorage.setItem(
      //   "user",
      //   JSON.stringify({ ...res.data.data, image: userImage })
      // );
      localStorage.setItem("user", JSON.stringify(res.data.data));
      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error);
      toast.error("Could Not Update Profile");
    }
    toast.dismiss(toastId);
  };
};

export const deleteProfile = (token, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("DELETE_PROFILE_API API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Profile Deleted Successfully");
      dispatch(logout(navigate));
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error);
      toast.error("Could Not Delete Profile");
    }
    toast.dismiss(toastId);
  };
};
