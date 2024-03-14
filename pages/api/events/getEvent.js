import Event from "@/models/Event";
import User from "@/models/User";
import dbConnect from "@/utils/db/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const client = await dbConnect("auth");

    const { eventId, userId } = req.body;

    if (!eventId || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    const user = await User.findById(userId);
    if(!user){
      return res
        .status(404)
        .json({ success: false, message: "Something went wrong" });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({ success: true, event });

  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
