import commitTimeLine from "@/githubControllers/commitTimeLine";
import searchCommits from "@/githubControllers/searchCommits";
import searchIssuesAndPRs from "@/githubControllers/searchIssuesAndPRs";
import searchRepositories from "@/githubControllers/searchRepositories";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    // Use Promise.all to wait for both promises to resolve concurrently.
    const commitSearchResults = await searchCommits();
    const issuesAndPRSearchResults = await searchIssuesAndPRs();
    const repositorySearchResults = await searchRepositories();
    const commitTimeLineResults = await commitTimeLine();

    // Combine the data from the two promises into a single object
    const data = {
      commitSearchResults,
      issuesAndPRSearchResults,
      repositorySearchResults,
      commitTimeLineResults,
    };

    // Send the combined data as a response
    res.status(200).json(data);
  } catch (error) {
    // Handle any errors that might occur during the execution of the promises
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
}
