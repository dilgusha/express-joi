import Joi from 'joi';
import { Blog } from '../models/blog.modul.js';
import { User } from '../models/user.model.js';

const getBlogsByUser = async (req, res, next) => {
    console.log(req.user);
    try {
        const user = await User.findById(req.user._id).populate('blogs', 'title desc');
        res.status(200).json(user.blogs);
    } catch (err) {
        next(err);
    }
};


const create = async (req, res, next) => {
    const data = await Joi.object({
        title: Joi.string().trim().min(3).max(50).required(),
        desc: Joi.string().trim().min(10).max(1000).required()
    })
        .validateAsync(req.body, { abortEarly: false })
        .catch(err => {
            return res.status(400).json({
                error: err.details.map(d => d.message),
            });
        });

    console.log(data);


    const userId = req.user._id;

    try {
        const newBlog = await Blog.create({
            ...data,
            user: userId,
            photo: req.file ? req.file.path : null
        });

        // await User.findByIdAndUpdate(userId, {
        //     $push: { blogs: newBlog._id }
        // });

        res.status(201).json(newBlog);
    } catch (err) {
        next(err);
    }
};


const deleteBlog = async (req, res, next) => {
    try {
        const blogId = req.params.id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You dont have permission' });
        }

        await Blog.findByIdAndDelete(blogId);

        // await User.findByIdAndUpdate(req.user._id, {
        //     $pull: { blogs: blogId }
        // });

        res.status(200).json({ message: 'Blog deleted' });
    } catch (err) {
        next(err);
    }
};


const updateBlog = async (req, res, next) => {
    try {
        const blogId = req.params.id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You dont have permission for update' });
        }

        const data = await Joi.object({
            title: Joi.string().trim().min(3).max(50).optional(),
            desc: Joi.string().trim().min(10).max(1000).optional(),
        })
            .validateAsync(req.body, { abortEarly: false })
            .catch(err => {
                return res.status(400).json({
                    error: err.details.map(d => d.message),
                });
            });

        if (req.file) blog.photo = req.file.path;
        

        blog.title = data.title || blog.title;
        blog.desc = data.desc || blog.desc;

        await blog.save();

        res.status(200).json({ message: 'Blog updated.', blog });
    } catch (err) {
        next(err);
    }
};

export const BlogController = () => ({
    create,
    getBlogsByUser,
    deleteBlog,
    updateBlog
})