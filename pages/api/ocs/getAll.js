import constants from "@/lib/constants";
import User from "@/models/User";
import dbConnect from "@/utils/db/dbConnect";

export default async function getAll(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const client = await dbConnect("auth");
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    console.log(user);
    if(!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user?.role !== constants.roles.COMMUNITY_ADMIN) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const ocs = await User.find({ role: constants.roles.OC });
    return res.json({ success: true, ocs });
  } catch (e) {
    console.log(e)
    return res.status(500).json({ success: false,message: "Something went wrong - DB" });
  }
}
