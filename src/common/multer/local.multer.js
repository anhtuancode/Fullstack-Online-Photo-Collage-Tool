import multer from "multer";
import fs from "fs"
import path from "path";
import { UPLOADFILES } from "../constant/app.constant";

const uploadDir = UPLOADFILES || "images";

fs.mkdirSync("images/", {recursive: true});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const fileExtName = path.extname(file.originalname);
    const uniqueSuffix = `local-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${fileExtName}`);
  },
});

const uploadLocal = multer({ storage: storage , limits:{
  fileSize: 1 * 1024 * 1024
}});

export default uploadLocal;
