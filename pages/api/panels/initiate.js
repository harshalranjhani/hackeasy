import mongoose from "mongoose";
import { Schema, model, models } from "mongoose";
import User from "./User"; 
import Project from "./Project"; 
import Panel from "./Panel";
import constants from "@/lib/constants";
import sendPanelInitMails from "./sendMails";

// Function to handle panel creation and allocation
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { eventId, userId, numberOfPanels } = req.body;

  try {
    const admin = await User.findOne({
      _id: userId,
      role: constants.roles.COMMUNITY_ADMIN,
    });
    if (!admin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }

    const ocs = await User.find({ role: constants.roles.OC, eventId });
    const projects = await Project.find({ eventId });

    if (numberOfPanels <= 0 || numberOfPanels > ocs.length) {
      return res.status(400).json({ message: "Invalid number of panels" });
    }

    const ocsPerPanel = Math.ceil(ocs.length / numberOfPanels);
    const projectsPerPanel = Math.ceil(projects.length / numberOfPanels);

    for (let i = 0; i < numberOfPanels; i++) {
      // Distribute OCs to panels
      const panelMemberStartIndex = i * ocsPerPanel;
      const panelMembers = ocs
        .slice(panelMemberStartIndex, panelMemberStartIndex + ocsPerPanel)
        .map((oc) => oc._id);

      // Distribute projects to panels
      const projectStartIndex = i * projectsPerPanel;
      const teamIds = projects
        .slice(projectStartIndex, projectStartIndex + projectsPerPanel)
        .map((project) => project._id);

      // Create and save the panel
      const panel = new Panel({
        eventId,
        teamIds,
        panelMembers,
      });

      await panel.save();

      // Update the projects with the panel id
      await Project.updateMany(
        { _id: { $in: teamIds } },
        { panelId: panel._id }
      );
    }

    await sendPanelInitMails(eventId);

    return res.status(200).json({ message: "Panels initiated successfully" });
  } catch (e) {
    console.error(e.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
