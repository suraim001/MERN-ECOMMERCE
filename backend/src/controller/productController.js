import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";

// Create A New Product
export const createProducts = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        next(new HandleError(error));
    }
};

// Get All Products
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        next(new HandleError(error));
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
        next(new HandleError(error));
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
        next(new HandleError(error));
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
        next(new HandleError(error));
    }
};