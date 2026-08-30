const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const env = require("../config/env");
const { AppError } = require("./error.middleware");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getR2Client } = require("../config/r2");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Fix: check originalUrl instead of baseUrl
    const isGallery = req.originalUrl.includes("gallery");
    const subfolder = isGallery ? "gallery" : "venues";
    cb(null, path.join(process.cwd(), env.upload.dir, subfolder));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Only JPEG, PNG, and WEBP images are allowed", 400));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.upload.maxFileSizeMb * 1024 * 1024 }
});
async function uploadToR2(fileBuffer, originalName, folder = "gallery") {
  const client = getR2Client();
  if (!client) return null;

  const key = `${folder}/${uuidv4()}-${originalName.replace(/\s+/g, "-")}`;

  await client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: "image/jpeg"
  }));

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
module.exports = { upload, uploadToR2 };