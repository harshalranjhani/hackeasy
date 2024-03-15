import { Schema, model, models } from "mongoose";
import User from "./User";
import constants from "@/lib/constants";

const EventSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide an event name"],
    },
    eventDescription: {
      type: String,
      required: [true, "Please provide an event description"],
    },
    eventDate: {
      type: Date,
      required: [true, "Please provide an event date"],
      // set default to 3 days from now
      default: new Date(new Date().setDate(new Date().getDate() + 3)),
    },
    eventExpireDate: {
      type: Date,
      required: [true, "Please provide an event expire date"],
      // set default to 3 days after event date
      default: new Date(new Date().setDate(new Date().getDate() + 6)),
    },
    noOfParticipants: {
      type: Number,
      required: [true, "Please provide number of participants"],
      min: 50,
      max: 1000,
      default: 50,
    },
    eventType: {
      type: String,
      required: [true, "Please provide an event type"],
      enum: [
        constants.eventType.ONLINE,
        constants.eventType.OFFLINE,
        constants.eventType.HYBRID,
      ],
      default: constants.eventType.ONLINE,
    },
    currentRound: {
      type: Number,
      required: [true, "Please provide current round"],
      enum: [1, 2, 3],
      default: 1,
    },
    prizePool: {
      type: Number,
      required: [true, "Please provide a prize pool"],
      default: 0,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide an author id"],
    },
    ocs: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: [true, "Please provide an oc id"],
    },
  },
  {
    timestamps: true,
    collection: "events",
  }
);

export default models.Event || model("Event", EventSchema);
