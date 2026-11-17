import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config({ path: 'backend/src/config/config.env' });

connectDB();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

// Handle uncaught exeption error
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Server is shutting down due to uncaught execption error");
    process.exit(1);
})

const port = process.env.PORT || 3000;


const server = app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`)
});

// console.log(myName);

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down, due to unhandled promise rejection`);
    server.close(() => {
        process.exit(1);
    })

})