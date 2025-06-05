import 'dotenv/config.js'

export const PORT = process.env.PORT;

export const CLOUD_NAME = process.env.CLOUD_NAME;
export const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
export const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;

export const UPLOADFILES = process.env.UPLOADFILES; 

export const REDIS_URL = process.env.REDIS_URL

console.log(CLOUD_API_KEY, CLOUD_API_SECRET, PORT, CLOUD_NAME);