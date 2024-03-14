import octokit from "./ocktokit";

export default async function commitTimeLine(githubUsername="harshalranjhani", githubRepo="hackeasy", startDate="2024-03-13", endDate="2024-03-15") {
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
    const allCommitsWithinRange = commitData.data.every((commit) => {
      const commitDate = new Date(commit.commit.author.date);
      return commitDate >= start && commitDate <= end;
    });

    if (allCommitsWithinRange) {
      return {
        success: true,
        message: "All commits occurred within the specified date range.",
      };
    } else {
      return {
        success: false,
        message: "Not all commits occurred within the specified date range.",
      };
    }
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
}
