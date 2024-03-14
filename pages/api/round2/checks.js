import basicChecks from "@/githubControllers/basicChecks";

export default async function handler(req,res) {
    return basicChecks(req,res);
}