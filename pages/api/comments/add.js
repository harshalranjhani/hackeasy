import constants from "@/lib/constants";
import Comment from "@/models/Comment";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, projectId, comment } = req.body;
    if (!userId || !projectId || !comment) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide all required fields",
        });
    }

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.role === constants.roles.USER)
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to perform this action",
        });

    try {
      const newComment = await Comment.create({ userId, projectId, comment });
      return res.status(201).json({ success: true, data: newComment });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid request method" });
  }
}
