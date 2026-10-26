import mongoose, { mongo } from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please enter Your name"],
        maxLength: [25, "Please enter a name with fewer than 25 characters"],
        minLength: [3, "Name should contain more than 3 characters"]
    },
    username: {
        type: String,
        required: [true, "Please enter your username"],
        unique: true,
        lowercase: true, 
        minLength: [3, "Username should contain at least 3 characters"],
        maxLength: [16, "Username cannot exceed 16 characters"],
        // Wrapped the custom character check inside a valid Mongoose validator
        validate: {
            validator: (val) => {
                // Allows alphanumeric characters and underscores (_)
                return validator.isAlphanumeric(val.replace(/_/g, ''));
            },
            message: "Username can only contain letters, numbers, and underscores"
        }
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password should contain more than 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
},{timestamps: true})

export default mongoose.model("User", userSchema);