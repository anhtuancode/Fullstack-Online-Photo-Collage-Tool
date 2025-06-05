import express from 'express'
import { PORT } from './src/common/constant/app.constant'
import rootRouter from './src/routers/root.router';
import { cleanImagesCron } from './src/common/cron/cleanImages.cron';
import cors from 'cors';



cleanImagesCron(); // Chaỵ cron trong thư mục server 

const app = express()
app.use(express.json());
app.use(cors());

app.use('/api', rootRouter);

app.listen(PORT, () => `Server is online on ${PORT}`)