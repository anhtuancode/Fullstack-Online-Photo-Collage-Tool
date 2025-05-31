import 'dotenv/config.js'

export const PORT = process.env.PORT;

export const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
export const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;

console.log(CLOUD_API_KEY, CLOUD_API_SECRET, PORT);