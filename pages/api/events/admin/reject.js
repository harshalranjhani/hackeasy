import constants from "@/lib/constants";
import sendMail from "@/lib/sendMail";
import Project from "@/models/Project";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { userId, projectId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== constants.roles.COMMUNITY_ADMIN) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to perform this action.",
      });
    }

    const project = await Project.findById(projectId).populate(
      {
        path: "teamId",
        populate: { path: "teamLead" },
      },
    );

    project.accepted = false;
    project.roundProgress = constants.projectRoundProgress.REJECTED;
    await project.save();

    const userEmail = project?.teamId?.teamLead?.email;

    await sendMail(
      userEmail,
      "Hackathon Project Update",
      `Dear ${userEmail},

      We appreciate your dedication and effort. However, after thorough consideration, we regret to inform you that your project did not meet the criteria to proceed further.
      
      Thank you for your hard work and participation. We hope to see you in future events.
      
      Best regards,
      Team hackEasy`
    );

    return res.status(200).json({ success: true, data: project });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      success: false,
      error: "An error occurred while processing your request.",
    });
  }
}
