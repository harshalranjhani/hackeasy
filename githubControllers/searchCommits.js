import octokit from "./ocktokit";

export default async function searchCommits(query) {
  try {
    const commitData = await octokit.request(`GET /search/commits?q=${query}`, {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    return { success: true, data: commitData.data };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
}
