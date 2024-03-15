import constants from "@/lib/constants";
import Event from "@/models/Event";
import Project from "@/models/Project";
import Team from "@/models/Team";
import User from "@/models/User";
import dbConnect from "@/utils/db/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400).json({ success: false, message: "Invalid method" });
  }

  const client = await dbConnect("auth");

  const { userId, eventId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.role !== constants.roles.COMMUNITY_ADMIN) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const projects = await Project.find({ eventId: eventId });

    const teams = await Team.find({ eventId: eventId });

    const teamsToBeReviewed = await Team.find({
      eventId: eventId,
      status: constants.projectRoundProgress.PENDING,
    });

    const data = {
      projectCount: projects.length,
      teamCount: teams.length,
      teamsToBeReviewed: teamsToBeReviewed.length,
    };

    return res.status(200).json({ success: true, data: data });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
