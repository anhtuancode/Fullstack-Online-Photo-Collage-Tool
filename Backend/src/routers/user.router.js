import express from 'express';
import { userController } from '../controllers/user.controller';
import uploadLocal from '../common/multer/local.multer';

const userRouter = express.Router();

// Tạo route 
userRouter.post("/upload-image", uploadLocal.single('path'), userController.uploadImage)
userRouter.post("/create-task", uploadLocal.array('paths', 10), userController.createTask)
userRouter.get("/check-status/:id", userController.getTaskStatus)


export default userRouter;