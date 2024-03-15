import Event from "@/models/Event";
import Project from "@/models/Project";
import dbConnect from "@/utils/db/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(400)
      .json({ success: false, message: "Method not allowed!" });
  }

  const {
    title,
    description,
    githubLink,
    figmaLink,
    extraLinks,
    techStack,
    futureProspects,
    projectId,
    eventId,
  } = req.body;

  const client = await dbConnect("auth");

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found!" });
    }

    const hackName = event.name;

    const project = await Project.findById(projectId).populate({
      path: "teamId",
      populate: {
        path: "teamLead",
      },
    });

    console.log(project);

    const userEmail = project?.teamId?.teamLead?.email;
    console.log(userEmail)

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project Not Found!" });
    }

    project.title = title;
    project.description = description;
    project.githubLink = githubLink;
    project.figmaLink = figmaLink;
    project.extraLinks = extraLinks;
    project.techStack = techStack;
    project.futureProspects = futureProspects;

    await project.save();

    const { username, repoName } = extractGitHubInfo(githubLink);
    if (!username || !repoName) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Something was wrong about the githubURL",
        });
    }

    await runChecks(username, repoName, hackName, userEmail);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ success: false, message: e.message });
  }
}

const runChecks = async (username, repoName, hackName, userEmail) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/round2/checks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          repoName,
          hackName,
          userEmail,
        }),
      }
    );

    const data = await response.json();
    return {success: data.success, message: data.message}
  } catch (e) {
    return { success: false, message: "Something went wrong!" };
  }
};

function extractGitHubInfo(url) {
  const urlObj = new URL(url);

  if (urlObj.hostname !== "github.com") {
    throw new Error("URL is not a GitHub URL");
  }

  const parts = urlObj.pathname.split("/").filter((part) => part.length);

  if (parts.length < 2) {
    throw new Error("URL does not include a username and a repository name");
  }

  const [username, repoName] = parts;

  return { username, repoName };
}