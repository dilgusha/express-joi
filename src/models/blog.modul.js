import mongoose, { Schema } from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    photo: {
        type: String, 
        trim: true,
    },
})

export const Blog = mongoose.model('Blog', blogSchema)