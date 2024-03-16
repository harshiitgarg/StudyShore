import mongoose, { Schema } from "mongoose";

const sectionSchema = new Schema(
  {
    sectionName: {
      type: String,
    },
    subSection: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubSection",
      },
    ],
  },
  { timestamps: true }
);

export const Section = mongoose.model("Section", sectionSchema);
