import User from "@/models/User";

export default async function handler(req,res) {
    const { method } = req;
    if (method === "POST") {
        try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "Please provide a userId" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
        } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
        }
    }
    return res.status(405).json({ message: "Method not allowed" });
}