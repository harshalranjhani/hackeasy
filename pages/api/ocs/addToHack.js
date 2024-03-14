import constants from "@/lib/constants";
import Event from "@/models/Event";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  // Connect to database
  const client = await dbConnect("auth");

  const { ocId, adminId, hackId } = req.body;

  try {
    const oc = await User.findById(ocId);
    const admin = await User.findById(adminId);

    if (
      oc?.role !== constants.roles.OC ||
      admin?.role !== constants.roles.COMMUNITY_ADMIN
    ) {
      return res.status(403).json({ success: false, message: "Invalid User" });
    }

    const hack = await Event.findById(hackId);
    await hack.ocs.push(ocId);
    await hack.save();

    return res.status(200).json({ success: true, message: "OC added to hack" });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}
