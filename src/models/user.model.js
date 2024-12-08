import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    refreshToken: {
        type: String,
        default: null,
        trim: true
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    verifyCode: {
        type: String,
        default: null
    },
    verifyCodeExpires: {
        type: Date,
        default: null
    },
    resetPassToken:{
        type: String,
        default: null
    },
    resetPassExpires:{
        type: Date,
        default: null
    }
})

export const User = mongoose.model('User', userSchema)