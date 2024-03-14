import commitTimeLine from "@/githubControllers/commitTimeLine";
import searchCommits from "@/githubControllers/searchCommits";

export default async function handler(req,res) {
    return commitTimeLine(req,res);
}