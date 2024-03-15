import { Schema, model, models } from "mongoose";
import Event from "./Event";
import constants from "@/lib/constants";

const FileSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please provide a file title"],
  },
  fileUrl: {
    type: String,
    required: [true, "Please provide a fileUrl"],
  },
  uploadedAt: {
    type: Date,
    required: [true, "Please provide an uploadedAt"],
    default: Date.now,
  },
});

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a project title"],
      default: "Name not provided"
    },
    description: {
      type: String,
      required: [true, "Please provide a project description"],
      default: "Description not provided",
    },
    githubLink: {
      type: String,
      required: [true, "Please provide a github link"],
      default: "Github link not provided",
    },
    figmaLink: {
      type: String,
      required: [true, "Please provide a figma link"],
      default: "Figma link not provided",
    },
    extraLinks: {
      type: String,
      required: [false, "Please provide extra links"],
      default: "Extra links not provided",
    },
    file: {
      type: FileSchema,
      required: [true, "Please provide a file"],
    },
    techStack: {
      type: String,
      required: [true, "Please provide a tech stack"],
      default: "Tech stack not provided",
    },
    futureProspects: {
      type: String,
      required: [true, "Please provide future prospects"],
      default: "Future prospects not provided",
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
      enum: [
        constants.projectRoundProgress.PENDING,
        constants.projectRoundProgress.APPROVED,
        constants.projectRoundProgress.REJECTED,
      ],
      default: constants.projectRoundProgress.PENDING,
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
    },
    panelId: {
      type: Schema.Types.ObjectId,
      ref: "Panel",
      required: [false, "Please provide a panel id"],
      // initially the panel id might not be available
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "projects",
  }
);

export default models.Project || model("Project", ProjectSchema);
