import jwt from 'jsonwebtoken';
import config from '../db/config.js';
import { User } from '../models/user.model.js';

const authorize = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: "Token tapilmadi"
        })
        
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: 'Authorization required' });
    }

    const verifyBearer = authHeader.startsWith("Bearer ")
    if (!verifyBearer) {
        return res.status(403).json({ message: "Bearer token is required" });
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Bearer token is required' });
    }

    const jwtSecret = config.jwtSecret

    try {
        const decoded = jwt.verify(token, jwtSecret);

        const user = await User.findById(decoded.sub).select("_id email fullname")
        if (!user) return res.status(401).json({ message: "User not found!" });

        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({
            message: error.message,
            error,
        });
    }
};

export default authorize;


// const authorize = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         return res.status(403).json({ message: "Authorization required" });
//     }

//     const jwt_secret = config.jwtSecret

//     const token = authHeader.split(" ")[1];
//     const verifyBearer = authHeader.startsWith("Bearer ")
//     if (!verifyBearer) {
//         return res.status(403).json({ message: "Bearer token is required" });
//     }
//     try {
//         const decoded = jwt.verify(token, jwt_secret);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Token not valid" });
//     }
// };
