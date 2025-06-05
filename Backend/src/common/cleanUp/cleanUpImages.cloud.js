import { v2 as cloudinary } from "cloudinary";
import { CLOUD_API_KEY, CLOUD_API_SECRET, CLOUD_NAME } from "../constant/app.constant";

// Configuration
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

export const cleanCloudinaryImages = async () => {
  try {
    const now = Date.now();
    const { resources } = await cloudinary.search
      .expression('folder:collages')
      .execute();

    for (const img of resources) {
      const createdAt = new Date(img.created_at).getTime();
      const hoursAgo = (now - createdAt) / (1000 * 60 * 60);
      if (hoursAgo > 1) {
        await cloudinary.uploader.destroy(img.public_id);
        console.log(`Deleted cloud: ${img.public_id}`);
      }
    }
  } catch (err) {
    console.error("Cleanup cloud error:", err.message);
  }
};