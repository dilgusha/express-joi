import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import { appRouter } from './src/routes/index.js'
import config from './src/db/config.js'
import errorMiddleware from './src/middlewares/errorMiddleware.js'

const app = express()

app.use(express.json())

mongoose.connect(config.mongoUrl)
    .then(() => {
        console.log('Connected to Mongoose database');
    })
    .catch((err) => {
        console.log(`${ err.message }`);
    })


    app.use('/api',appRouter)
    app.use(errorMiddleware);

const port = config.port
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})