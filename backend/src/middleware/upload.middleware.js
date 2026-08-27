const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const env = require("../config/env");
const { AppError } = require("./error.middleware");

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

module.exports = { upload };