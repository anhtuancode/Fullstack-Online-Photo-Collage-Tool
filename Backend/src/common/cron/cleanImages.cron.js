import cron from 'node-cron';
import { cleanUpImages } from '../cleanUp/cleanUpImages.local';
import { cleanCloudinaryImages } from '../cleanUp/cleanUpImages.cloud';

export const cleanImagesCron = () =>{
  cron.schedule('0 * * * *', async () => {
    await cleanUpImages();
    await cleanCloudinaryImages();
    console.log('running a task every hour');
  });
}
