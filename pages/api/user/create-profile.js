import User from "@/models/User";

export default async function handler(req, res) {
  const { method } = req;
  if (method === "POST") {
    try {
      const {
        userId,
        gitHubLink,
        linkedInLink,
        specialization,
        proofOfWork,
      } = req.body;
      if (!userId) {
        return res
          .status(400)
          .json({ message: "Please provide a userId and a role" });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.gitHubLink = gitHubLink;
      user.linkedInLink = linkedInLink;
      user.specialization = specialization;
      user.proofOfWork = proofOfWork;
      await user.save();
      console.log(user)
      return res
        .status(200)
        .json({ success: true, message: "Profile created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  return res.status(405).json({ message: "Method not allowed" });
}
