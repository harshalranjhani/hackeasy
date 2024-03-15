import commitTimeLine from "@/githubControllers/commitTimeLine";
import searchCommits from "@/githubControllers/searchCommits";
import searchIssuesAndPRs from "@/githubControllers/searchIssuesAndPRs";
import searchRepositories from "@/githubControllers/searchRepositories";

export default async function getChecks(query) {
  try {
    // Use Promise.all to wait for both promises to resolve concurrently.
    const commitSearchResults = await searchCommits(query);
    // const issuesAndPRSearchResults = await searchIssuesAndPRs(query);
    const repositorySearchResults = await searchRepositories(query);
    const commitTimeLineResults = await commitTimeLine();

    // Combine the data from the two promises into a single object
    const data = {
      commitSearchResults,
      // issuesAndPRSearchResults,
      repositorySearchResults,
      commitTimeLineResults,
    };

    // Send the combined data as a response
    return { success: true, data };
  } catch (error) {
    // Handle any errors that might occur during the execution of the promises
    console.error("Error occurred:", error);
    return { error: "An error occurred while processing your request." };
  }
}
