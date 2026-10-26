import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";
import validator from "validator";

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

        const token = user.getJWTtoken();

        res.status(201).json({
            success: true,
            user,
            token
        })
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
        const token = user.getJWTtoken();
        user.password = undefined;

        res.status(200).json({
            success: true,
            user,
            token
        })

    } catch (error) {
        next(error);
    }
}