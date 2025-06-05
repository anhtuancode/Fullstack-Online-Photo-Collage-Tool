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
  async createCollage(req, res, next) {
    try {
      const result = await userService.createCollage(req);
      const response = responseSuccess(result, `Collage image successfully`);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
  async getCollageStatus(req, res, next) {
    try {
      const result = await userService.getCollageStatus(req);
      const response = responseSuccess(result, `Get Collage status successfully`);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};
