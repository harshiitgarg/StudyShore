import mongoose, { Schema } from "mongoose";

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
  },
});

export const Tag = mongoose.model("Tag", tagSchema);
