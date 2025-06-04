import express from 'express'
import { PORT } from './src/common/constant/app.constant'
import rootRouter from './src/routers/root.router';

const app = express()
app.use(express.json());


app.use(rootRouter);

app.listen(PORT, () => `Server is online on ${PORT}`)