import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config({path: 'backend/config/config.env'});

connectDB();

const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`)
})