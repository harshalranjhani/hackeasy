import octokit from "./ocktokit";

export default async function searchRepositories(query = "test") {
  try {
    const commitData = await octokit.request(
      `GET /search/repositories?q=${query}`,
      {
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
