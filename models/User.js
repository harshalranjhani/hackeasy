import constants from "@/lib/constants";
import { Schema, model, models } from "mongoose";
import Participation from "./Participation";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      default: null,
    },
    authType: {
      // credentials or oauth
      type: String,
      required: [true, "Please provide an auth type"],
    },
    emailVerified: {
      type: Date,
      required: [false, "Please provide an email verification status"],
      default: null,
    },
    image: {
      type: String,
      required: [false, "Please provide an image url"],
      default: null,
    },
    role: {
      type: String,
      required: [true, "Please provide a role"],
      enum: [
        constants.roles.USER,
        constants.roles.OC,
        constants.roles.COMMUNITY_ADMIN,
      ],
      default: "user",
    },
    participations: {
      type: [Schema.Types.ObjectId],
      ref: "Participation",
      required: [false, "Please provide a participation"],
      default: [],
    },
    gitHubLink: {
      type: String,
      required: [false, "Please provide a GitHub link"],
      default: null,
    },
    linkedInLink: {
      type: String,
      required: [false, "Please provide a LinkedIn link"],
      default: null,
    },
    specialization: {
      type: String,
      required: [false, "Please provide a specialization"],
      enum: [
        constants.specializations.FRONTEND,
        constants.specializations.BACKEND,
        constants.specializations.FULLSTACK,
        constants.specializations.DEVOPS,
        constants.specializations.MOBILE,
        constants.specializations.UI_UX,
        constants.specializations.AI,
        constants.specializations.ML,
        constants.specializations.CLOUD,
        constants.specializations.BLOCKCHAIN,
        constants.specializations.GAME,
        constants.specializations.IOT,
        constants.specializations.ARVR,
        constants.specializations.OTHER,
      ],
      default: null,
    },
    proofOfWork: {
      type: String,
      required: [false, "Please provide a proof of work"],
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export default models.User || model("User", UserSchema);
