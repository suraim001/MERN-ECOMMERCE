import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URI).then((data) => {
        console.log(`MongoDB Connected. host: ${data.connection.host}`);
    }).catch((err) => {
        console.log(err.message);
    })
}