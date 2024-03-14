import sendMail from "@/lib/sendMail";
import octokit from "./ocktokit";

export default async function basicChecks(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    githubUsername = "harshalranjhani",
    githubURL,
    repositoryName = "soundverse-saas",
    hackName = "Technica",
    userEmail = "ranjhaniharshal@gmail.com",
  } = req.body;

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
      return res
        .status(200)
        .json({ success: false, message: "Repository is empty." });
    }

    return res
      .status(200)
      .json({ success: true, message: "All basic checks passed!" });
  } catch (e) {
    // console.error(e);
    sendMail(
      userEmail,
      "Action Needed: Hackathon Submission",
      `Dear ${githubUsername},
    Your submission requires attention. Your GitHub link is invalid or not public. Please rectify this issue promptly to ensure consideration.
      Best regards,
      Team ${hackName}
    `
    );
    return res
      .status(500)
      .json({ success: false, error: "Repository is private!" });
  }
}
