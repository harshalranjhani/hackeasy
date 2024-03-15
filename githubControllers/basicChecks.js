import sendMail from "@/lib/sendMail";
import octokit from "./ocktokit";
import Project from "@/models/Project";

export default async function basicChecks(req, res) {
  const { githubUsername, repositoryName, userEmail, hackName, projectId } = req.body;
  console.log(githubUsername)
  console.log(repositoryName)

  try {
    console.log(userEmail);
    const repoData = await octokit.request(
      `GET /repos/${githubUsername}/${repositoryName}/contents/`,
      {
        owner: "OWNER",
        repo: "REPO",
        path: "PATH",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    console.log(repoData)

    if (repoData.data.length === 0) {
      sendMail(
        userEmail,
        "Action Needed: Hackathon Submission",
        `Dear ,
          Your submission requires attention. Your GitHub repository lacks valid content. Please rectify this issue promptly to ensure consideration.
          Best regards,
          Team ${hackName}
          `
      );
      console.log("Repository is empty");
      return { success: false, message: "Repository is empty." };
    }

    console.log("All basic checks passed");
    const project = await Project.findById(projectId);
    project.gitHubLinkVerified = true;
    await project.save();
    return { success: true, message: "All basic checks passed!" };
  } catch (e) {
    console.error(e);
    sendMail(
      userEmail,
      "Action Needed: Hackathon Submission",
      `Dear ${githubUsername},
    Your submission requires attention. Your GitHub link is invalid or not public. Please rectify this issue promptly to ensure consideration.
      Best regards,
      Team ${hackName}
    `
    );
    console.log("Repository is private");
    return { success: false, error: "Repository is private!" };
  }
}
