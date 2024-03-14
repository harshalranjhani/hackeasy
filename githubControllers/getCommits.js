import octokit from "./ocktokit";

export default async function getCommits(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { githubUsername="harshalranjhani", githubRepo="hackeasy" } = req.body;

  try {
    const commitData = await octokit.request(`GET /repos/${githubUsername}/${githubRepo}/commits`, {
      owner: "OWNER",
      repo: "REPO",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    return res.status(200).json({ success: true, data: commitData.data });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}
