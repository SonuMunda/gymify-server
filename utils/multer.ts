import multer from "multer";
import path from "path";

// Multer config
export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("Unsupported file type!") as unknown as null, false);
      return;
    }
    cb(null, true);
  },
});
