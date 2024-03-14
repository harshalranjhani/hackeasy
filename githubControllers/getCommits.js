import octokit from "./ocktokit";

export default async function getCommits(
  githubUsername = "harshalranjhani",
  githubRepo = "hackeasy"
) {
  try {
    const commitData = await octokit.request(
      `GET /repos/${githubUsername}/${githubRepo}/commits`,
      {
        owner: "OWNER",
        repo: "REPO",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return { success: true, data: commitData.data };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
}
