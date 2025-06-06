import Queue from "bull";
import { REDIS_URL } from "../common/constant/app.constant.js"; 

const imageProcessingQueue = new Queue("image-processing", REDIS_URL);

export const imageService = {
  async createTaskJob(files, layout, borderWidth, borderColor) {
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
      removeOnComplete: false, 
      removeOnFail: false, 
    });
    return job;
  },

  async getTaskStatus(jobId) {
    const job = await imageProcessingQueue.getJob(jobId);
    if (!job) {
      return { status: 'failed', error: 'Job not found' };
    }
    const state = await job.getState();

    if (state === 'completed') {
      const result = await job.finished();
      if (result && result.collageUrl) {
        return {
          status: 'completed',
          collageUrl: result.collageUrl,
        };
      } else if (typeof result === 'string') {
        return {
          status: 'completed',
          collageUrl: `http://localhost:3000/${result.replace(/\\/g, '/')}`,
        };
      } else {
        return {
          status: 'completed',
          result: result.base64 || result,
        };
      }
    } else if (state === 'failed') {
      return {
        status: 'failed',
        error: job.failedReason || 'Job failed',
      };
    } else {
      return {
        status: state === 'active' ? 'processing' : 'pending',
      };
    }
  },
};