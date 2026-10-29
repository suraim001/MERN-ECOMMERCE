import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import validator from "validator";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Register
export const registerUser = async (req, res, next) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) return next(new HandleError("All the fields are required", 400));

        const user = await User.create({
            name,
            username,
            email,
            password,
            avatar: {
                public_id: "This is temp public_id",
                url: "This is temp url"
            },
            isLoggedIn: true
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
        user.isLoggedIn = true;
        if (user.resetPasswordToken) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
        }
        await user.save({ validateBeforeSave: false });
        user.password = undefined;

        sendToken(user, 200, res);

    } catch (error) {
        next(error);
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) return next(new HandleError("Unsuccessful! Please login first", 400));
        res.clearCookie('token');
        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findByIdAndUpdate(decodedData.id, { isLoggedIn: false }, { runValidators: false });
        // console.log(user);

        if (!user) {
            return next(new HandleError("Something went wrong", 500));
        }

        res.status(200).json({
            success: true,
            message: "Successfully Logged Out"
        })
    } catch (error) {
        return next(error);
    }
}

// Forgot Password
export const resetPasswordRequest = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return next(new HandleError("Provide your email address"));

        if (!validator.isEmail(email)) {
            return next(new HandleError("Invalid Email Address!", 400));
        }

        const user = await User.findOne({ email });

        if (!user) return next(new HandleError("User doesn't exist", 400));

        let resetToken;
        try {
            resetToken = user.generatePasswordResetToken();
            await user.save({ validateBeforeSave: false });

        } catch (error) {
            return next(new HandleError("Could not save reset token, please try again later", 500));
        }

        const resetPasswordURL = `${process.env.BACKEND_URL}/api/v1/login/reset/${resetToken}`;
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
            await user.save({ validateBeforeSave: false });
            return next(new HandleError("Email couldn't be sent, please try again later.", 500));
        }

    } catch (error) {
        return next(error);
    }
}

//  Reset Password
export const resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })

        if (!user) {
            return next(new HandleError("Reset Password Token is invalid or has been expired!", 400));
        }

        const { password, confirmPassword } = req.body;
        if (!password || !confirmPassword) return next(new HandleError("Invalid! Password fields cannot be empty"))
        if (password !== confirmPassword) return next(new HandleError("Password Doesn't match", 400))

        user.password = password;
        user.isLoggedIn = true;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        user.password = undefined;
        sendToken(user, 200, res);
    } catch (error) {
        return next(error);
    }
}

// Get User Details
export const getUserDetails = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return next(new HandleError("Error: User Not Found!", 404));

        user.email = undefined;
        // user.username = undefined;

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return next(error);
    }
}

// Get User Details (Own)
export const getOwnUserDetails = (req, res, next) => {
    try {
        const user = req.user;

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return next(error);
    }
}

// Update Password
export const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) return next(new HandleError("Invalid! Password fields cannot be empty", 400))

        if (newPassword !== confirmPassword) return next(new HandleError("Password doesn't match", 400));

        const user = await User.findById(req.user.id).select("+password");

        const checkPasswordMatch = await user.verifyPassword(oldPassword);

        if (!checkPasswordMatch) return next(new HandleError("Inavlid! Incorrect Password", 401));

        user.password = newPassword;
        await user.save();
        user.password = undefined;
        sendToken(user, 200, res);

    } catch (error) {
        return next(error);
    }
}

// Updating user profile
export const updateProfile = async (req, res, next) => {
    try {
        const { name, username } = req.body;
        const updateUserDetails = {
            name,
            username
        }
        if (!name || !username) return next(new HandleError("Name or username cannot be empty", 400));

        if ('email' in req.body || 'password' in req.body || '_id' in req.body || 'role' in req.body) return next(new HandleError("Only name and username can be changed", 401));

        const user = await User.findByIdAndUpdate(req.user.id, updateUserDetails, {
            returnDocument: "after",
            runValidators: true
        })

        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user
        })
    } catch (error) {
        return next(error);
    }
}

// Admin - Get all users information
export const getUsersList = async(req, res, next) => {
    try {
        const users = await User.find();
        if(!users){
            return next(new HandleError("Something went wrong", 500));
        }
        res.status(200).json({
            success: true,
            users
        })

    } catch (error) {
        return next(error);
    }
}

// Admin - Get Single User Information
export const getSingleUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return next(new HandleError("User doesn't exist", 404));
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return next(error);
    }
}

// Admin - Change User Role
export const updateUserRole = async(req, res, next) => {
    try {
        const { role } = req.body;
        if(!role) return next(new HandleError("Invalid Input", 400))
        const newUserData = {
            role
        }
        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            runValidators: true,
            returnDocument: 'after'
        });
        if(!user) return next(new HandleError("User doesn't exist", 404));

        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return next(error);
    }
}

// Admin - Delete User Profile
export const deleteUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return next(new HandleError("User doesn't exist", 404));

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "User is Deleted Successfully"
        })
    } catch (error) {
        return next(error);
    }
}

