import Product from "../models/productModel.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import HandleError from "../utils/handleError.js";

// Create A New Product
export const createProducts = async (req, res, next) => {
    try {
        req.body.user = req.user._id;
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

// Get All Products
export const getAllProducts = async (req, res, next) => {
    try {
        const resultPerPage = Number(req.query.limit) || process.env.PAGE_LIMIT;
        const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter();

        // Getting filtered query before pagination
        const filteredQuery = apiFeatures.query.clone();
        const productCount = await filteredQuery.countDocuments();

        // Calculate total pages based on filtered count
        const totalPages = Math.ceil(productCount / resultPerPage);
        const page = Number(req.query.page) || 1;

        if (page > totalPages && productCount > 0) {
            return next(new HandleError("This page doesn't exist", 404))
        }

        // Apply pagination
        apiFeatures.pagination(resultPerPage);
        const products = await apiFeatures.query;

        if (!products || products.length === 0) return next(new HandleError("No Product Found", 404));

        res.status(200).json({
            success: true,
            products,
            productCount,
            resultPerPage,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
};

// Update A Product
export const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: "after",
            runValidators: true
        });

        if (!product) return next(new HandleError("Product Not Found", 404));

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

// Delete A Poduct
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return next(new HandleError("Product Not Found", 404));

        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        });
    } catch (error) {
        next(error);
    }
};

// Accessing Single Product
export const getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return next(new HandleError("Product Not Found", 404));

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

// Creating and Updating Review
export const createOrUpdateReview = async (req, res, next) => {
    try {
        const { ratings, comment } = req.body;
        if (!ratings || !comment) return next(new HandleError("Please give a rating and write a comment first", 400));

        const review = {
            user: req.user._id,
            name: req.user.name,
            ratings: Number(ratings),
            comment
        }
        const product = await Product.findById(req.query.id);
        if (!product) return next(new HandleError("Product not found", 404));

        const reviewExists = product.reviews.find(review => review.user.toString() === req.user._id.toString());

        if (reviewExists) {
            product.reviews.forEach(review => {
                if (review.user.toString() === req.user._id.toString()) {
                    review.ratings = ratings;
                    review.comment = comment;
                }
            })
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }
        let totalRatings = 0;
        product.reviews.forEach(review => {
            totalRatings += review.ratings
        })

        product.ratings = product.reviews.length > 0 ? totalRatings / product.reviews.length : 0;
        await product.save({
            validateBeforeSave: true,
            returnDocument: "after"
        })

        res.status(200).json({
            success: true,
            product
        })

    } catch (error) {
        return next(error);
    }
}

// Get Reviews
export const getProductReviews = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.id);
        if (!product) return next(new HandleError("Product Not Found", 404));

        res.status(200).json({
            success: true,
            reviews: product.reviews
        })
    } catch (error) {
        next(error);
    }
}

// Delete Reviews
export const deleteReview = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.id);
        if (!product) return next(new HandleError("Product not found", 404));

        const isReviewExist = product.reviews.some(
            (review) => review.user.toString() === req.user._id.toString()
        );
        if (!isReviewExist) return next(new HandleError("Review not found", 404));

        product.reviews = product.reviews.filter(review => review.user.toString() !== req.user._id.toString());

        let totalRatings = 0;
        product.reviews.forEach(review => {
            totalRatings += review.ratings
        })

        product.ratings = product.reviews.length > 0 ? totalRatings / product.reviews.length : 0;
        product.numOfReviews = product.reviews.length;
        await product.save({
            returnDocument: "after",
            runValidators: true
        })

        res.status(200).json({
            success: true,
            message: "Review Deleted Successfully",
            product
        })
    } catch (error) {
        next(error);
    }
}

// Admin - Get all products
export const getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        if (!products || products.length === 0) return next(new HandleError("No Product Found", 404));
        res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        return next(error);
    }
}