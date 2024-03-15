import { Schema, model, models } from "mongoose";
import User from "./User";
import Event from "./Event";
import Project from "./Project";
import constants from "@/lib/constants";

const VoteSchema = new Schema(
  {
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Please provide a team id"],
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Please provide an event id"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user id"],
    },
    vote: {
      type: String,
      required: [true, "Please provide a vote"],
      enum: [constants.vote.YES, constants.vote.NO, constants.vote.MAYBE],
      default: constants.vote.MAYBE,
    },
  },
  {
    timestamps: true,
    collection: "votes",
  }
);

export default models.Vote || model("Vote", VoteSchema);
