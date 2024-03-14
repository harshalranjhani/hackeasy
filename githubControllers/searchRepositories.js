import octokit from "./ocktokit";

export default async function searchCommits(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body;

  try {
    const commitData = await octokit.request("GET /search/repositories", {
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
