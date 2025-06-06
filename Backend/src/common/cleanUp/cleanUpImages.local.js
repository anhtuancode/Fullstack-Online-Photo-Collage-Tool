import fs from "fs/promises";
import path from "path";
import { UPLOADFILES } from "../constant/app.constant";

export const cleanUpImages = async () => {
  try {
    const images = await fs.readdir(UPLOADFILES);
    const now = Date.now();

    for (const image of images) {
      const filePath = path.join(UPLOADFILES, image);
      const stats = await fs.stat(filePath);

      const fileAgeInMinutes = (now - stats.mtimeMs) / (1000 * 60); // mtimeMs là "modified time" tính bằng milliseconds

      if (fileAgeInMinutes > 10) {
        await fs.unlink(filePath);
        console.log(`Deleted: ${image}`);
      }
    }
  } catch (err) {
    console.error("Cleanup error:", err.message);
  }
};
