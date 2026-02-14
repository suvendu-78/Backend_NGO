import multer from "multer";
import fs from "fs";
import path from "path";

// TEMP FOLDER
const uploadPath = path.join(process.cwd(), "public", "temt");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// ALLOW PDF + IMAGE
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF & Image allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
