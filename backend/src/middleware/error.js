import HandleError from "../utils/handleError.js";

export default (err, req, res, next) => {

    // console.log(err);

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // CastError
    if (err.name === 'CastError') {
        const message = `Invalid resource: ${err.path}`;
        err = new HandleError(message, 404);
    }

    // Duplicate key error
    if (err.code === 11000) {
        const message = `This ${Object.keys(err.keyValue)} already registered. Please Login to continue.`;
        err = new HandleError(message, 400);
    }

    // JWT TokenExpiredError
    if (err.name === "TokenExpiredError") {
        res.clearCookie("token");
        err = new HandleError("Session Expired! Please login again", 401);
    }

    // JsonWebTokenError
    if (err.name === "JsonWebTokenError") {
        res.clearCookie("token");
        err = new HandleError("Invalid token. Please login again", 401);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}