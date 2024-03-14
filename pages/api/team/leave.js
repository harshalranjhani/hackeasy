import Participation from "@/models/Participation";
import Team from "@/models/Team";
import User from "@/models/User";
import dbConnect from "@/utils/db/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await dbConnect("auth");

    const { userId, teamId } = req.body;
    if (!userId || !teamId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    const isJoined = team.teamMembers.includes(userId);
    if (!isJoined) {
      return res
        .status(400)
        .json({ success: false, message: "User is not in the team" });
    }

    await team.teamMembers.pull(userId);

    await team.save();

    const participation = await Participation.findOneAndDelete({
      userId: userId,
      teamId: teamId,
    });

    return res
      .status(200)
      .json({ success: true, message: "You have left the team" });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
