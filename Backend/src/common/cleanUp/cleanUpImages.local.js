import fs from "fs/promises";
import path from "path";
import { UPLOADFILES } from "../constant/app.constant";

export const cleanUpImages = async () => {
  try {
    const images = await fs.readdir(UPLOADFILES);

    for (const image of images) {
      const filePath = path.join(UPLOADFILES, image);
      await fs.unlink(filePath);
      console.log(`Deleted: ${image}`);
    }
  } catch (err) {
    console.error("Cleanup error:", err.message);
  }
};
