import express from 'express';
import { authRoute } from './auth.route.js';
import { blogRoute } from './blog.route.js';

export const appRouter = express.Router()

appRouter.use('/auth',authRoute)
appRouter.use('/blog',blogRoute)