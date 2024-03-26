import multer from "multer";
import path from "path";
import HttpError from "../helpers/HttpError.js";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const extension =file.originalname.split(".").pop();
    const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueFileName}.${extension}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 20,
};

const fileFilter = (req, file, cb) => {
  const extension = file.originalname.split(".").pop();
  if (extension === "exe") {
    return cb(HttpError(400, ".exe extension not allowed"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
