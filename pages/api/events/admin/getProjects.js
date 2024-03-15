import constants from "@/lib/constants";
import Event from "@/models/Event";
import Project from "@/models/Project";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { eventId, userId } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== constants.roles.COMMUNITY_ADMIN) {
      return res
        .status(403)
        .json({ success: false,error: "You are not authorized to perform this action." });
    }

    const projects = await Project.find({ eventId: eventId, gitHubLinkVerified: true });
    console.log(projects, eventId)

    return res.status(200).json({success: true, data: projects});
  } catch (e) {
    console.log(e.message);
    return res
      .status(500)
      .json({ success: false,error: "An error occurred while processing your request." });
  }
}
