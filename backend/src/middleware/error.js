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
        let message;
        const errorKey = Object.keys(err.keyValue)[0];
        if (errorKey.includes("username")) {
            message = 'This username is already taken. Please choose a different username';
        }
        else if (errorKey.includes("email")) {
            message = 'An account is already registered with this email. Please try to login instead.';
        }
        else{
            message = `Duplicate Key Error: ${errorKey}`
        }
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