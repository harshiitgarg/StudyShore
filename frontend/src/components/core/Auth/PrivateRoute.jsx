import React from "react";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const token = useSelector((store) => store.auth.token);
  if (!token) return null;
  return children;
};

export default PrivateRoute;
