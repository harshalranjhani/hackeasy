import getCommits from "@/githubControllers/getCommits";

export default async function getCommitsHandler(req, res) {
    return getCommits(req,res);
}