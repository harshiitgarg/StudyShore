import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
import profileRouter from "./routes/profile.route.js";
import categoryRouter from "./routes/category.route.js";
import courseRouter from "./routes/course.route.js";
import sectionRouter from "./routes/section.route.js";
import subSectionRouter from "./routes/subSection.route.js";
import ratingAndReviewRouter from "./routes/ratingAndReview.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/section", sectionRouter);
app.use("/api/v1/subSection", subSectionRouter);
app.use("/api/v1/ratingAndReview", ratingAndReviewRouter);

export { app };
