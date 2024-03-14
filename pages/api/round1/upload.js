import multer from "multer";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";
import User from "@/models/User";
import Project from "@/models/Project";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Use the /tmp directory for temporary file storage
// Add a fileFilter to accept only PDFs and PPTs
const upload = multer({
  dest: "/tmp",
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/vnd.ms-powerpoint" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      cb(null, true); // Accept file
    } else {
      cb(null, false); // Reject file
      cb(new Error("Only PDF and PowerPoint files are allowed!"));
    }
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const multerSingle = upload.single("file");

  const multerPromise = () =>
    new Promise((resolve, reject) => {
      multerSingle(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

  try {
    await multerPromise();

    const file = req.file;
    if (!file)
      throw new Error("The file is missing or the file type is not allowed.");

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
    });

    await fs.unlink(file.path);

    console.log(result);

    // database logic
    const title = result.original_filename;
    const fileUrl = result.url;

    // const user = await User.findById(userId);
    // const project = await Project.findById(projectId).populate({
    //   path: "teamId",
    //   populate: {
    //     path: "teamMembers",
    //   },
    // });

    // if (!user || !project) throw new Error("User or project not found");

    // check if user id is in project teamMembers
    // const isUserInTeam = project.teamId.teamMembers.some(
    //   (member) => member._id.toString() === userId
    // );

    return res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ error: error.message });
  }
}
