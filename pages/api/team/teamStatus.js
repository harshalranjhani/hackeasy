import Participation from "@/models/Participation";
import User from "@/models/User";
import dbConnect from "@/utils/db/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
    s;
  }

  const client = await dbConnect("auth");

  try {
    const { userId, eventId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const participation = await Participation.findOne({
      userId: userId,
      eventId: eventId,
    })
      .populate({
        path: "teamId",
        populate: {
          path: "teamMembers",
        },
      })
      .exec();

    console.log(participation);
    return res.status(200).json({ success: true, team: participation });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
