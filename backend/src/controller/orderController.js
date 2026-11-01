import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";

// Create New Order
export const createNewOrder = async(req, res, next) => {
    try {
        const {shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice} = req.body;

        if(!shippingInfo || !orderItems || !paymentInfo || !itemPrice || !taxPrice || !shippingPrice || !totalPrice) return next(new HandleError("All the fields are required", 400));

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            order
        })

    } catch (error) {
        next(error)
    }
}

// Admin - Get Single Order
export const getSingleOrder = async(req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if(!order) return next(new HandleError("No Order Found", 404));

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        next(error);
    }
}

// User - Get All of my Orders
export const getAllMyOrders = async(req, res, next) => {
    try {
        const orders = await Order.find({user: req.user._id});
        if(!orders) return next(new HandleError("No Order Found", 404));

        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        next(error);
    }
}

// Admin - Get All Orders
export const getAllOrders = async(req, res, next) => {
    try {
        const orders = await Order.find();
        if(!orders) return next(new HandleError("No Order Found", 404));

        let totalAmount = 0;
        orders.forEach(order=>{
            totalAmount += order.totalPrice;
        })

        res.status(200).json({
            success: true,
            orders,
            totalAmount
        })
    } catch (error) {
        next(error);
    }
}

// Update Order Status
export const updateOrderStatus = async(req, res, next) => {
    try {
        const {status} = req.body;
        if(!status) return next(new HandleError("Provide a valid order status", 400));

        const order = await Order.findById(req.params.id);
        if(!order) return next(new HandleError("No Order Found", 404));

        if(order.orderStatus === "delivered") return next(new HandleError("This order has already been delivered", 400));

        await Promise.all(order.orderItems.map(item => updateQuantity(item.product, item.quantity)))

        order.orderStatus = status;

        if(order.orderStatus === "delivered") order.deliveredAt = Date.now();

        await order.save({validateBeforeSave: false})
        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        next(error);
    }
}

async function updateQuantity(id, quantity){
    const product = await Product.findById(id);
    if(!product) return next(new HandleError("Product Not Found", 404));

    product.stock -= quantity;
    await product.save({validateBeforeSave: false});
}

// Delete Order
export const deleteOrder = async(req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if(!order) return next(new HandleError("Order Not Found", 404));

        if(order.orderStatus !== "delivered") return next(new HandleError("Not delivered yet. Order cannot be deleted.", 400));

        await Order.deleteOne({_id: req.params.id});
        res.status(200).json({
            success: true,
            message: "Order Deleted Successfully"
        })
    } catch (error) {
        next(error);
    }
}