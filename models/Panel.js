import { Schema, model, models } from "mongoose";
import User from "./User";
import Event from "./Event";
import Project from "./Project";
import constants from "@/lib/constants";

const PanelSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Please provide an event id"],
    },
    teamIds: {
      type: [Schema.Types.ObjectId],
      ref: "Project",
      required: [true, "Please provide team ids"],
    },
    panelMembers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: [true, "Please provide panel members"],
    },
  },
  {
    timestamps: true,
    collection: "panels",
  }
);

export default models.Panel || model("Panel", PanelSchema);
