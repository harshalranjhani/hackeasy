import User from "@/models/User";
import dbConnect from "@/utils/db/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    // connect to db
    const client = await dbConnect("auth");

    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    console.log(user);
    return res.status(200).json({ success: true, role: user.role });
  } catch (e) {
    console.log(e)
    return res.status(500).json({ success: false, message: e.message });
  }
}
