import Comment from "@/models/Comment";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a project id",
      });
    }

    try {
      const comments = await Comment.find({ projectId });
      return res.status(200).json({ success: true, data: comments });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid request method" });
  }
}
