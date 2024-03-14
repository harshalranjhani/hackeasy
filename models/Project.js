import { Schema, model, models } from "mongoose";
import Event from "./Event";
import constants from "@/lib/constants";

const FileSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a file title"],
    },
    fileUrl: {
      type: String,
      required: [true, "Please provide a fileUrl"],
    },
  },
  {
    timestamps: true,
    collection: "files",
  }
);

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a project title"],
    },
    description: {
      type: String,
      required: [true, "Please provide a project description"],
    },
    githubLink: {
      type: String,
      required: [true, "Please provide a github link"],
    },
    file: {
      type: FileSchema,
      required: [true, "Please provide a file"],
    },
    techStack: {
      type: String,
      required: [true, "Please provide a tech stack"],
    },
    futureProspects: {
      type: String,
      required: [true, "Please provide future prospects"],
    },
    gitHubLinkVerified: {
      type: Boolean,
      required: [true, "Please provide a github link verification status"],
      default: false,
    },
    gitHubContainsCode: {
      type: Boolean,
      required: [true, "Please provide a github code status"],
      default: false,
    },
    accepted: {
      type: Boolean,
      required: [true, "Please provide a project acceptance status"],
      default: false,
    },
    currentRound: {
      type: Number,
      required: [true, "Please provide a current round"],
      enum: [1, 2, 3],
      default: 1,
    },
    roundProgress: {
      type: String,
      required: [true, "Please provide a round progress"],
      enum: [constants.projectRoundProgress.PENDING, constants.projectRoundProgress.APPROVED, constants.projectRoundProgress.REJECTED],
      default: constants.projectRoundProgress.PENDING,
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
  },
  {
    timestamps: true,
    collection: "projects",
  }
);

export default models.Project || model("Project", ProjectSchema);
