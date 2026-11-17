import express from 'express';
import cookieParser from 'cookie-parser';
import product from './routes/productRoutes.js';
import user from './routes/userRoutes.js';
import order from './routes/orderRoutes.js';
import errorHandleMiddleware from "./middleware/error.js";
import fileUpload from 'express-fileupload';


const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(fileUpload());

// Routes
app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);

app.use(errorHandleMiddleware);

export default app;