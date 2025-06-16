import { v2 as cloudinary } from "cloudinary";
import { CLOUD_API_KEY, CLOUD_API_SECRET, CLOUD_NAME } from "../constant/app.constant";
import sharp from "sharp";


// Configuration
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

const uploadResult = async (buffer, folder = "images") =>{
    return await new Promise((resolve) => {
        cloudinary.uploader
          .upload_stream({ folder, quality: 'auto:best' }, (error, uploadResult) => {
            return resolve(uploadResult);
          })
          .end(buffer);
      });
}

export default uploadResult;