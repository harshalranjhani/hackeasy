import Participation from "@/models/Participation";
import Team from "@/models/Team";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, teamDescription, teamLead, eventId } = req.body;
    if (!name || !teamDescription || !teamLead || !eventId) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    try {
      const user = await User.findById(teamLead).populate("participations");
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

      const code = Math.random().toString(36).slice(-8);

      const team = await Team.create({
        name,
        teamDescription,
        teamLead,
        eventId,
        teamCode: code,
      });

      // add participant schema for the user
      const participation = await Participation.create({
        userId: teamLead,
        eventId,
        teamId: team._id,
      });

      await user.participations.push(participation._id);
      await user.save();

      return res.status(201).json({
        success: true,
        data: team,
        message: "Created the team successfully!",
      });
    } catch (error) {
      console.error(error);
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
