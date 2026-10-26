import Product from "../models/productModel.js";
import APIFunctionality from "../utils/apiFunctionality.js";
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
        next(error);
    }
};

// Get All Products
export const getAllProducts = async (req, res, next) => {
    try {
        const resultPerPage = 3;
        const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter();
        
        // Getting filtered query before pagination
        const filteredQuery = apiFeatures.query.clone();
        const productCount = await filteredQuery.countDocuments();

        // Calculate total pages based on filtered count
        const totalPages = Math.ceil(productCount/resultPerPage);
        const page = Number(req.query.page) || 1;

        if(page>totalPages && productCount>0){
            return next(new HandleError("This page doesn't exist", 404))
        }
        
        // Apply pagination
        apiFeatures.pagination(resultPerPage);
        const products = await apiFeatures.query;

        if(!products || products.length === 0) return next(new HandleError("No Product Found", 404));

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