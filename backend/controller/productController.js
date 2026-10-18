import Product from "../models/productModel.js";

// Create A New Product
export const createProducts = async(req,res) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
};

// Get All Products
export const getAllProducts = async(req,res)=>{

    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    });
};

// Update A Product
export const updateProduct = async(req,res) => {
    let product = await Product.findById(req.params.id);
    if(!product) return res.status(500).json({
        success: false,
        message: "Product Not Found!"
    })
    try {
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: "after",
        runValidators: true
    })

    res.status(200).json({
        success: true,
        product
    })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error
        })
    }
    
}

// Delete A Poduct
