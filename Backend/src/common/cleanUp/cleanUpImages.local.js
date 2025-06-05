import fs from 'fs/promises';
import path from 'path';
import { UPLOADFILES } from '../constant/app.constant';

export const cleanUpImages = async () => {
  try {
    const time = Date.now();
    const images = await fs.readdir(UPLOADFILES);

    for (const image of images) {
      const filePath = path.join(UPLOADFILES, image);
      const stats = await fs.stat(filePath);
      const timeCreateImage = (time - stats.mtimeMs) / (1000 * 60 * 60); 

      if (timeCreateImage > 1) {
        await fs.unlink(filePath);
        console.log(`Deleted: ${image}`);
      }
    }
  } catch (err) {
    console.error('Cleanup error:', err.message);
  }
};