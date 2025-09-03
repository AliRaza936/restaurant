import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

// Ensure "public/image" exists
const uploadDir = path.join(process.cwd(), "public", "image");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 Created upload folder:", uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // now guaranteed to exist
  },
  filename: function (req, file, cb) {
    const fileName = uuidv4() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

export const upload = multer({ storage });
