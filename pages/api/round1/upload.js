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

    console.log(req.body.teamId)
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

    addRound1PPt(fileUrl, title, req.body.teamId, req.body.eventId);

    return res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ error: error.message });
  }
}

const addRound1PPt = async (fileUrl, fileName, teamId,eventId) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/round1/storeFileInDb`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileUrl,
        fileName,
        teamId: teamId,
        eventId: eventId,
      }),
    });

    const data = await response.json();
    console.log(data);
    if (data.success) {
      // toast.success("File uploaded successfully.");
      // toast.message(data.message);
      console.log("File uploaded successfully.")
    } else {
      // toast.error("Failed to upload file.");
      console.log("Failed to upload file.")
    }
  } catch (e) {
    console.log(e.message)
  }
};
