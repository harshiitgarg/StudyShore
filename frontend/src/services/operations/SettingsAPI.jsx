import toast from "react-hot-toast";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { settingsEndpoints } from "../apis";

const { UPDATE_PROFILE_PICTURE } = settingsEndpoints;

export const updateProfilePicture = (token, formData) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
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
    toast.dismiss(toastId);
  };
};
