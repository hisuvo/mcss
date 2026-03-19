import multer from "multer";
import fs from "node:fs";
import path from "node:path";

// Ensure uploads folder exists
const uploadPath = path.join(process.cwd(), "uploads");

// if don't exist then create first
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// store config
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadPath);
  },

  filename: function (req, file, callback) {
    const uniqueName =
      file.originalname.split(".")[0] +
      "-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    callback(null, uniqueName + path.extname(file.originalname));
  },
});

// file filter (security)
const fileFilter: multer.Options["fileFilter"] = (req, file, callback) => {
  const allowed = [
    // images
    "image/jpeg",
    "image/png",
    "image/webp",

    // text
    "text/plain",

    // pdf
    "application/pdf",

    // audio
    "audio/mpeg",
    "audio/wav",

    // video
    "video/mp4",
    "video/webm",
  ];

  if (allowed.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Invalid file type"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
});
