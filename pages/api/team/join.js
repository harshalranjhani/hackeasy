// join team api

import Participation from "@/models/Participation";
import Team from "@/models/Team";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, eventId, teamCode } = req.body;
    if (!userId || !teamCode || !eventId) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    try {
      const user = await User.findById(userId).populate("participations");
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      user.participations.forEach((participation) => {
        if (participation.eventId === eventId) {
          return res
            .status(400)
            .json({ success: false, message: "User already joined the event" });
        }
      });
      const team = await Team.findOne({ teamCode });
      if (!team) {
        return res
          .status(404)
          .json({ success: false, message: "Team not found" });
      }

      if (team.teamMembers.length >= 3) {
        return res
          .status(400)
          .json({ success: false, message: "Team is full" });
      }

      // check if user already joined the team
      const isJoined = team.teamMembers.includes(userId);
      if (isJoined) {
        return res
          .status(400)
          .json({ success: false, message: "User already joined the team" });
      }

      const participation = await Participation.create({
        userId,
        eventId,
        teamId: team._id,
      });
      await team.teamMembers.push(userId);
      await team.save();
      await user.participations.push(participation._id);
      await user.save();
      return res.status(201).json({
        success: true,
        data: participation,
        message: "Joined the team successfully!",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
