import octokit from "./ocktokit";

export default async function commitTimeLine(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Destructure or provide defaults for githubUsername, githubRepo, startDate, and endDate
  const { 
    githubUsername = "harshalranjhani", 
    githubRepo = "hackeasy",
    startDate='2024-03-13',
    endDate='2024-03-14' 
  } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Start date and end date are required" });
  }

  try {
    const commitData = await octokit.request(
      `GET /repos/${githubUsername}/${githubRepo}/commits`,
      {
        owner: githubUsername,
        repo: githubRepo,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    // Check if all commits occurred between the specified dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const allCommitsWithinRange = commitData.data.every(commit => {
      const commitDate = new Date(commit.commit.author.date);
      return commitDate >= start && commitDate <= end;
    });
    
    if (allCommitsWithinRange) {
      return res.status(200).json({ success: true, message: "All commits occurred within the specified date range." });
    } else {
      return res.status(200).json({ success: false, message: "Not all commits occurred within the specified date range." });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}
