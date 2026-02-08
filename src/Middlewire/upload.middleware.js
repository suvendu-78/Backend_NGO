import multer from "multer";
import fs from "fs";

// create folder automatically if not exists
const uploadPath = "/tmp/my-uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// MULTER INSTANCE
const Uploadfile = multer({
  storage: storage,
});

export default Uploadfile;
