import { Schema, model, models } from "mongoose";
import User from "./User";
import Event from "./Event";
import Project from "./Project";
import constants from "@/lib/constants";

const CommentSchema = new Schema(
  {
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide a user id"],
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: [true, "Please provide a project id"],
    },
    comment: {
        type: String,
        required: [true, "Please provide a comment"],
    }
  },
  {
    timestamps: true,
    collection: "comments",
  }
);

export default models.Comment || model("Comment", CommentSchema);
