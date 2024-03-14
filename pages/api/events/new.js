import constants from "@/lib/constants";
import Event from "@/models/Event";
import User from "@/models/User";
import dbConnect from "@/utils/db/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(400)
      .json({ success: false, message: "Method not allowed!" });
  }

  const client = await dbConnect("auth");

  try {
    const {
      name,
      eventDescription,
      eventDate,
      eventExpireDate,
      noOfParticipants,
      eventType,
      userId,
    } = req.body;

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

    if (user.role !== constants.roles.COMMUNITY_ADMIN) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to create an event",
        });
    }

    const newEvent = await Event.create({
      name,
      eventDescription,
    //   eventDate,
    //   eventExpireDate,
      noOfParticipants,
      eventType,
      authorId: userId,
    });

    return res.status(201).json({ success: true, event: newEvent });

  } catch (e) {
    console.log(e)
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
