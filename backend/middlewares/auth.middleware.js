import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Unauthorized request", {}));
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json(new ApiResponse(401, "Invalid token", {}));
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(401, error?.message || "Invalid access token", {}));
  }
});

const isStudent = asyncHandler(async (req, res, next) => {
  try {
    if (!req.user?.accountType !== "Student") {
      return res
        .status(401)
        .json(new ApiResponse(401, "This is only for students", {}));
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          "User role cannot be verified. Please try again later",
          {}
        )
      );
  }
});

const isInstructor = asyncHandler(async (req, res, next) => {
  try {
    if (!req.user?.accountType !== "Instructor") {
      return res
        .status(401)
        .json(new ApiResponse(401, "This is only for instructors", {}));
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          "User role cannot be verified. Please try again later",
          {}
        )
      );
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    if (!req.user?.accountType !== "Admin") {
      return res
        .status(401)
        .json(new ApiResponse(401, "This is only for admins", {}));
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          "User role cannot be verified. Please try again later",
          {}
        )
      );
  }
});

export { verifyJWT, isStudent, isInstructor, isAdmin };
