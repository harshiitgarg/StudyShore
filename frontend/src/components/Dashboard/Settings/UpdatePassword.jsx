import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const UpdatePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const { user } = useSelector((store) => store.profile);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <>
      <form>
        <div>
          <h1>Password</h1>
          <div>
            <label htmlFor="oldPassword">Current Password</label>
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              id="oldPassword"
              defaultValue={user?.password}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default UpdatePassword;
