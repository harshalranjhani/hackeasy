import constants from "@/lib/constants";
import { Schema, model, models } from "mongoose";
import User from "./User";
import Team from "./Team";
import Event from "./Event";

const ParticipationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user id"],
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Please provide an event id"],
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [false, "Please provide a team id"],
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "participations",
  }
);

export default models.Participation ||
  model("Participation", ParticipationSchema);
