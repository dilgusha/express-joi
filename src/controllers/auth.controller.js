import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js';
import config from '../db/config.js';
import nodeMailer from 'nodemailer'
import crypto from 'crypto';


const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}
const register = async (req, res, next) => {
    const data = await Joi.object({
        fullName: Joi.string().trim().min(3).max(40).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().min(8).max(20).required()
    })
        .validateAsync(req.body, { abortEarly: false })
        .catch(err => {
            return res.status(400).json({
                error: err.details.map(d => d.message),
            });
        });

    const existsUser = await User.findOne({ email: data.email })
    if (existsUser) {
        return res.json({
            message: `${data.email} - already exist!`
        })
    }
    data.password = await bcrypt.hash(data.password, 10)
    const newUser = await User.create(data)
    res.status(200).json(newUser)

}
const login = async (req, res, next) => {
    const data = await Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().min(8).max(20).required()
    })
        .validateAsync(req.body, { abortEarly: false })

        .catch(err => {
            return res.status(400).json({
                error: err.details.map(d => d.message),
            });
        });

    const user = await User.findOne({ email: data.email });
    if (!user) return res.status(401).json({ message: 'Password or email incorrect' });


    const password = await bcrypt.compare(data.password, user.password);
    if (!password) return res.status(401).json({ message: 'Password or email incorrect' });

    const payload = {
        sub: user._id
    }
    const jwt_secret = config.jwtSecret

    const refreshSecret = config.refreshSecret;

    const accessToken = jwt.sign(payload, jwt_secret);
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
        accessToken,
        refreshToken
    });


}

const myProfile = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Profile data retrieved successfully',
            user: {
                fullName: user.fullName,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};


// const refreshToken = async (req, res) => {
//     const { refreshToken } = req.body;

//     if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

//     try {
//         const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
//         const user = await User.findById(decoded.sub);

//         if (!user || user.refreshToken !== refreshToken) {
//             return res.status(403).json({ message: 'Invalid refresh token' });
//         }

//         const accessToken = jwt.sign({ sub: user._id }, process.env.SECRET_KEY, { expiresIn: '15m' });

//         res.json({ accessToken });
//     } catch (err) {
//         res.status(403).json({ message: 'refresh token is not valid' });
//     }
// };

const logout = async (req, res) => {
    try {
        const user = req.user;

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.refreshToken = null;
        await user.save();

        res.status(200).json({ message: 'Logout successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};



const getUserBlogs = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('blogs');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.blogs);
    } catch (err) {
        next(err);
    }
}

// const transporter = nodeMailer.createTransport({
//     service: "Gmail",
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

// const verifyEmail = async (req, res) => {
//     const user = req.user
//     const email = req.user.email;

//     const mailOptions = {
//         from: process.env.EMAIL,
//         to: email,
//         subject: 'Email Verification',
//         html: `to verify your email address`
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error("Error sending email: ", error);
//             return res.status(500).json({
//                 message: error.message,
//                 error,
//             })
//         } else {
//             console.log("Email sent: ", info);
//             return res.json({ message: "Check your email" })
//         }
//     });
// }





const transporter = nodeMailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const verifyEmail = async (req, res) => {
    const userId = req.user._id; 

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const verifyCode = crypto.randomBytes(3).toString('hex').toUpperCase(); 
        const expiresIn = Date.now() + 1 * 60 * 1000;

        user.verifyCode = verifyCode;
        user.verifyCodeExpires = expiresIn;
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Email Verification',
            html: `
                <h3>Email Təsdiqi</h3>
                <p>Hörmətli ${user.fullName},</p>
                <p>Emailinizi təsdiqləmək üçün aşağıdakı kodu istifadə edin:</p>
                <h2>${verifyCode}</h2>
                <p>Bu kod 10 dəqiqə ərzində etibarlıdır.</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email göndərmə xətası: ", error);
                return res.status(500).json({ message: "Failed to send email." });
            }
            console.log("Email sent: ", info.response);
            return res.json({ message: "Email sent. Check your email." });
        });

    } catch (error) {
        console.error("Error in sendVerifyCode function: ", error);
        return res.status(500).json({ message: "There is a error" });
    }
};


const checkVerifyCode = async (req, res) => {
    const { code } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.verifyCode || user.verifyCodeExpires < Date.now()) {
            return res.status(400).json({ message: "The code is not available or has expired." });
        }

        if (user.verifyCode !== code) {
            return res.status(400).json({ message: "The code is incorrect" });
        }

        user.verifyCode = null;
        user.verifyCodeExpires = null;
        user.verifyEmail = true
        await user.save();

        return res.json({ message: "Code verified!" });

    } catch (error) {
        console.error("Error in checkVerifyCode function: ", error);
        return res.status(500).json({ message: "There is a error" });
    }
};


export const AuthController = () => ({
    login,
    register,
    logout,
    myProfile,
    getAllUsers,
    getUserBlogs,
    verifyEmail,
    checkVerifyCode
})


