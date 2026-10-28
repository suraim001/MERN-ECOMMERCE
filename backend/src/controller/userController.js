import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import validator from "validator";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";

// Register
export const registerUser = async (req, res, next) => {
    try {
        const { name, username, email, password } = req.body;

        const user = await User.create({
            name,
            username,
            email,
            password,
            avatar: {
                public_id: "This is temp public_id",
                url: "This is temp url"
            }
        })
        user.password = undefined;

        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
}

// Login
export const loginUser = async (req, res, next) => {
    try {

        const { email, username, password } = req.body;
        if ((!email && !username) || !password) {
            return next(new HandleError("Email/Username or Password cannot be empty", 400));
        }
        const query = email ? { email } : { username };
        const user = await User.findOne(query).select("+password");
        if (!user) return next(new HandleError("Invalid Credentials", 401));

        const isPasswordValid = await user.verifyPassword(password);
        if (!isPasswordValid) {
            return next(new HandleError("Invalid Credentials", 401));
        }
        user.password = undefined;

        sendToken(user, 200, res);

    } catch (error) {
        next(error);
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })

        res.status(200).json({
            success: true,
            message: "Successfully Logged Out"
        })
    } catch (error) {
        next(error);
    }
}

// Reset Password
export const requestPasswordReset = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) return next(new HandleError("User doesn't exist", 400))
        
        let resetToken;
        try {
            resetToken = user.generatePasswordResetToken();
            await user.save({validateBeforeSave:false});
            
        } catch (error) {
            return next(new HandleError("Could not save reset token, please try again later", 500));
        }

        const resetPasswordURL = `http://localhost/api/v1/password/reset/${resetToken}`;
        const message = `Use the following link to reset your password: ${resetPasswordURL}.\n\nThis link will expire in 30 minutes.\n\nIf you didn't request for password reset, please let us know immediately.\n\n\nFawaj Suraim\n- Customer Service, Ecommerce`;
        
        try {
            // Send Email
            await sendEmail({
                email: user.email,
                subject: "Password Reset Request",
                message: message
            })
            res.status(200).json({
                success: true,
                message: `Email is sent to ${user.email} successfully`
            })
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({validateBeforeSave: false});
            return next(new HandleError("Email couldn't be sent, please try again later.", 500));
        }
            
    } catch (error) {
        return next(error);
    }
}