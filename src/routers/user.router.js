import express from 'express';
import { userController } from '../controllers/user.controller';
import uploadLocal from '../common/multer/local.multer';

const userRouter = express.Router();

// Tạo route 
userRouter.post("/upload-image", uploadLocal.single('path'), userController.uploadImage)
userRouter.post("/collage", uploadLocal.array('path', 10), userController.createCollage)
userRouter.get("/collage/status/:id", userController.getCollageStatus)


export default userRouter;