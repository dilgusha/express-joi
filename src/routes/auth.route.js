import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import authorize from '../middlewares/authorizationMiddleware.js';

export const authRoute = express.Router()

const controller = AuthController()

authRoute.post('/login', controller.login)
authRoute.post('/register', controller.register)
authRoute.get('/users', authorize, controller.getAllUsers)
authRoute.post('/logout/:id', authorize, controller.logout)
authRoute.get('/my-profile', authorize, controller.myProfile)
authRoute.get('/get-all-user-blogs', authorize, controller.getUserBlogs)
authRoute.get('/verify-email', authorize, controller.verifyEmail)
