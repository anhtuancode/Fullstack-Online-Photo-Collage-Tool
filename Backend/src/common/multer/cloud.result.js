import { v2 as cloudinary } from "cloudinary";
import { CLOUD_API_KEY, CLOUD_API_SECRET } from "../constant/app.constant";


// Configuration
cloudinary.config({
  cloud_name: "dgzknzxns",
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

const uploadResult = async (buffer, folder = "images") =>{
    return await new Promise((resolve) => {
        cloudinary.uploader
          .upload_stream({ folder }, (error, uploadResult) => {
            return resolve(uploadResult);
          })
          .end(buffer);
      });
}

export default uploadResult;