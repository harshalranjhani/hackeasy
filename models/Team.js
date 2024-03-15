import { Schema, model, models } from "mongoose";
import User from "./User";
import Event from "./Event";
import Project from "./Project";
import constants from "@/lib/constants";

const TeamSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a team name"],
    },
    teamDescription: {
      type: String,
      required: [true, "Please provide a team description"],
    },
    teamMembers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: [true, "Please provide team members"],
      default: [],
    },
    teamLead: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a team lead"],
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Please provide an event id"],
    },
    status: {
      type: String,
      required: [true, "Please provide a status"],
      enum: [
        constants.participationStatus.PENDING,
        constants.participationStatus.ACCEPTED,
        constants.participationStatus.REJECTED,
      ],
      default: constants.participationStatus.PENDING,
    },
    teamCode: {
      type: String,
      required: [true, "Please provide a team code"],
      unique: true,
      default: Math.random().toString(36).slice(-8),
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Please provide a project id"],
    },
  },
  {
    timestamps: true,
    collection: "teams",
  }
);

export default models.Team || model("Team", TeamSchema);
