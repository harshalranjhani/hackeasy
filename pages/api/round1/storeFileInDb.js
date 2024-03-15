import Project from "@/models/Project";
import Team from "@/models/Team";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { fileUrl, fileName, teamId, eventId } = req.body;
  console.log(req.body);

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, error: "Team not found" });
    }

    const project = await Project.create({
      teamId,
      eventId,
      file: {
        title: fileName,
        fileUrl,
      },
    });

    await project.save();

    team.projectId = project._id;

    await team.save();

    console.log(project);

    return res.status(200).json({ success: true, data: project });
  } catch (e) {
    console.log(e);
    console.log("ERROR! ERROR! ERROR!");
    return res.status(500).json({ success: false, error: e.message });
  }
}
