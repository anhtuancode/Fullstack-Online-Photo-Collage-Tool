import Queue from "bull";
import { REDIS_URL } from "../common/constant/app.constant.js"; 

const imageProcessingQueue = new Queue("image-processing", REDIS_URL);

export const imageService = {
  async createCollageJob(files, layout, borderWidth, borderColor) {
    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new Error("No files provided for collage.");
    }
    if (!layout || (layout !== "horizontal" && layout !== "vertical")) {
      throw new Error("Invalid layout. Must be 'horizontal' or 'vertical'.");
    }
    if (typeof borderWidth !== "number" || borderWidth < 0) {
      throw new Error("Border width must be a non-negative number.");
    }

    if (!borderColor) {
      borderColor = "#000000"; 
    }

    const jobData = {
      files,
      layout,
      border_width: borderWidth,
      border_color: borderColor,
    };

    const job = await imageProcessingQueue.add(jobData, {
      attempts: 3, 
      backoff: {
        type: "exponential",
        delay: 1000, 
      },
      removeOnComplete: true, 
      removeOnFail: false, 
    });
    return job;
  },

  async getJobStatus(jobId) {
    const job = await imageProcessingQueue.getJob(jobId);
    if (!job) {
      return null;
    }
    const state = await job.getState();
    const result = await job.finished(); 
    return {
      id: job.id,
      state: state,
      progress: job.progress,
      result: result,
      failedReason: job.failedReason,
    };
  },
};