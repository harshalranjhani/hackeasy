import sendMail from "@/lib/sendMail";
import Event from "@/models/Event";
import Panel from "@/models/Panel";
import Project from "@/models/Project";
import Team from "@/models/Team";
import User from "@/models/User";

// send the panel members a mail with the assigned projects
export default async function sendPanelInitMails(eventId) {
  try {
    const panels = await Panel.find({ eventId: eventId }).populate("teamIds");
    const event = await Event.findById(eventId);
    const projects = await Project.find({ eventId: eventId });
    const users = await User.find({ _id: { $in: event.ocs } });
    const teamLeads = await User.find({
      _id: { $in: projects.map((project) => project.teamLead) },
    });
    const teams = await Team.find({
      _id: { $in: projects.map((project) => project.teamId) },
    });
    for (let i = 0; i < panels.length; i++) {
      const panel = panels[i];
      const panelMembers = await User.find({
        _id: { $in: panel.panelMembers },
      });
      let panelProjects = projects.filter((project) =>
        panel.teamIds.includes(project._id)
      );
      let panelTeamLeads = teamLeads.filter((teamLead) =>
        panelProjects.map((project) => project.teamLead).includes(teamLead._id)
      );
      let panelTeams = teams.filter((team) =>
        panelProjects.map((project) => project.teamId).includes(team._id)
      );
      for (let j = 0; j < panelMembers.length; j++) {
        const panelMember = panelMembers[j];
        panelTeamLeads = panelTeamLeads.filter((teamLead) =>
          panelTeams.map((team) => team.teamLead).includes(teamLead._id)
        );
        panelProjects = panelProjects.filter((project) =>
          panelTeams.map((team) => team._id).includes(project.teamId)
        );
        panelTeams = panelTeams.filter((team) =>
          panelProjects.map((project) => project.teamId).includes(team._id)
        );
        await sendMail(
          panelMember.email,
          "Panel Allocation",
          `You have been allocated to a panel for the event ${
            event.name
          }. The projects assigned to your panel are: ${panelProjects
            .map((project) => project.name)
            .join(
              ", "
            )}. The team leads for these projects are: ${panelTeamLeads
            .map((teamLead) => teamLead.name)
            .join(", ")}. The teams are: ${panelTeams
            .map((team) => team.name)
            .join(", ")}.`
        );
      }
    }

    console.log("Panel allocation mails sent");
  } catch (e) {
    console.error(e.message);
  }
}
