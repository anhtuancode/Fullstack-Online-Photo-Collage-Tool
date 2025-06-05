import { BadRequestException } from "../common/helpers/exception.helper";
import { imageService } from "./image.service";

export const userService = {
  uploadImage: async function (req) {
    const file = req.file;

    if (!file) throw new BadRequestException("File isnt found");

    return {
      folder: "images/",
      filename: file.filename,
      imgUrl: `images/${file.filename}`,
    };
  },
  createCollage: async function (req) {
    const files = req.files
      ? req.files.map((file) => file.path)
      : req.body.files;
    const { layout, border_width, border_color } = req.body;

    if (!files || files.length === 0) {
      throw new BadRequestException("No images provided for collage.");
    }

    // Chuyển đổi border_width sang số
    const parsedBorderWidth = Number(border_width);
    if (isNaN(parsedBorderWidth) || parsedBorderWidth < 0) {
      throw new BadRequestException(
        "Invalid border_width. Must be a non-negative number."
      );
    }

    // Gọi service để thêm tác vụ vào hàng đợi
    const job = await imageService.createCollageJob(
      files,
      layout,
      parsedBorderWidth,
      border_color
    );

    return job;
  },
  getCollageStatus: async function (req) {
    const { jobId } = req.params;
    const jobStatus = await imageService.getJobStatus(jobId);

    if (!jobStatus) {
      throw BadRequestException("Collage job not found");
    }
    return jobStatus;
  },
};
