import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import jwt from "jsonwebtoken";

export const verifyUserAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        // console.log(token);
        if (!token) return next(new HandleError("User Logged Out! Please login first", 401))

        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(decodedData);
        const user = await User.findById(decodedData.id);
        // console.log(user);
        if (!user) {
            res.clearCookie('token');
            return next(new HandleError("Authentication failure! Please login to continue", 401));
        }

        if (user.resetPasswordExpire && user.resetPasswordExpire < new Date(Date.now())) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }
        req.user = user;
        next();

    } catch (error) {
        next(error);
    }
}

export const roleBasedAccess = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new HandleError(`Role:${req.user.role} - Not Allowed!`, 403))

        next();
    }
}