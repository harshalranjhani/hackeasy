import octokit from "./ocktokit";

export default async function searchIssuesAndPRs(query = "test") {
  try {
    const encodedQuery = encodeURIComponent(query);
    const issuesData = await octokit.request(
      `GET /search/issues?q=${encodedQuery}+is:issue`, 
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const PRData = await octokit.request(
      `GET /search/issues?q=${encodedQuery}+is:pull-request`, 
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return {
      success: true,
      data: { issuesData: issuesData.data, PRData: PRData.data },
    };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Internal server error" };
  }
}
