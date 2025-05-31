import express from 'express'
import { PORT } from './src/common/constant/app.constant'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(PORT)