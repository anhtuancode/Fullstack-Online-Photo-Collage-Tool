import { responseSuccess } from "../common/helpers/response.help";
import { userService } from "../services/user.service";
import { imageService } from "../services/image.service";

export const userController = {
  uploadImage: async function (req, res, next) {
    try {
      const result = await userService.uploadImage(req);
      const response = responseSuccess(result, `Upload image successfully`);
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },
  async createTask(req, res, next) {
    try {
      const result = await userService.createTask(req);
      const response = responseSuccess(result, `Collage image successfully`);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
  async getTaskStatus(req, res, next) {
    try {
      const result = await userService.getTaskStatus(req);
      const response = responseSuccess(result, `Get task status successfully`);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};
