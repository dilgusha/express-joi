import express from 'express';
import { BlogController } from '../controllers/blog.controller.js';
import authorize from '../middlewares/authorizationMiddleware.js';
import { upload } from '../middlewares/multer.middleware.js';

export const blogRoute = express.Router()

const controller = BlogController()

blogRoute.post('/create', authorize, upload.single('photo'), controller.create)
blogRoute.get('/delete/:id', authorize, controller.deleteBlog)
blogRoute.post('/update/:id', authorize, upload.single('photo'), controller.updateBlog)
blogRoute.get('/get-all-blogs', authorize, controller.getBlogsByUser)
