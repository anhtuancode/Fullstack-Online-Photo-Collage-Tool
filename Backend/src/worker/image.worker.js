import Queue from "bull";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { REDIS_URL, UPLOADFILES } from "../common/constant/app.constant";
import uploadResult from "../common/multer/cloud.result.js";


const queue = new Queue("image-processing", REDIS_URL);

export const processJob = async (job) => {
  const { files, layout, border_width, border_color } = job.data;

  const images = await Promise.all(
    files.map(filePath => sharp(filePath).toBuffer({ resolveWithObject: true }))
  );

  let totalWidth, totalHeight, result;

  if (layout === "horizontal") {
    const minHeight = Math.min(...images.map(img => img.info.height));
    const resized = await Promise.all(
      images.map(img =>
        sharp(img.data)
          .resize({ height: minHeight })
          .toBuffer({ resolveWithObject: true })
      )
    );
    totalWidth = resized.reduce((sum, img) => sum + img.info.width, 0) + border_width * (resized.length + 1);
    totalHeight = minHeight + 2 * border_width;

    result = sharp({
      create: {
        width: totalWidth,
        height: totalHeight,
        channels: 4,
        background: border_color,
      },
    });

    let x = border_width;
    const composites = resized.map(img => {
      const composite = { input: img.data, left: Math.round(x), top: border_width };
      x += img.info.width + border_width;
      return composite;
    });

    await result.composite(composites);
  } else {
    const minWidth = Math.min(...images.map(img => img.info.width));
    const resized = await Promise.all(
      images.map(img =>
        sharp(img.data)
          .resize({ width: minWidth })
          .toBuffer({ resolveWithObject: true })
      )
    );
    totalHeight = resized.reduce((sum, img) => sum + img.info.height, 0) + border_width * (resized.length + 1);
    totalWidth = minWidth + 2 * border_width;

    result = sharp({
      create: {
        width: totalWidth,
        height: totalHeight,
        channels: 4,
        background: border_color,
      },
    });

    let y = border_width;
    const composites = resized.map(img => {
      const composite = { input: img.data, left: border_width, top: Math.round(y) };
      y += img.info.height + border_width;
      return composite;
    });

    await result.composite(composites);
  }

  const outputPath = path.join(UPLOADFILES, `collage_${job.id}.png`);
  await result.png().toFile(outputPath);

  const buffer = await fs.readFile(outputPath);
  const cloudResult = await uploadResult(buffer, "collages");

  await fs.unlink(outputPath);

  for (const file of files) {
    try {
      await fs.unlink(file);
      console.log("Đã xóa file:", file);
    } catch (err) {
      console.error("Không xóa được file:", file, err.message);
    }
  }

  return { cloudUrl: cloudResult.secure_url };
};

// Register worker
queue.process(processJob);

// Logging (tối giản)
queue.on("completed", (job, result) => {
  console.log(`✅ Job ${job.id} completed.`);
});
queue.on("failed", (job, error) => {
  console.error(`❌ Job ${job.id} failed:`, error.message);
});

console.log("🔧 Image processing worker is running...");
