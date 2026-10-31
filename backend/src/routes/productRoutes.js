import express from 'express';
import { createOrUpdateReview, createProducts, deleteProduct, deleteReview, getAdminProducts, getAllProducts, getProductReviews, getSingleProduct, updateProduct } from '../controller/productController.js';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';

const router = express.Router();

// Routes
router.route("/status")
.get((req,res) => res.status(200).send("Server is Live!"));

router.route("/products")
.get(getAllProducts);

router.route("/admin/products")
.get(verifyUserAuth, roleBasedAccess("admin"), getAdminProducts);

router.route("/admin/product/create")
.post(verifyUserAuth, roleBasedAccess("admin"),  createProducts);

router.route("/admin/product/:id")
.patch(verifyUserAuth, roleBasedAccess("admin"), updateProduct)
.delete(verifyUserAuth, roleBasedAccess("admin"), deleteProduct);

router.route("/product/review")
.put(verifyUserAuth,createOrUpdateReview)
.delete(verifyUserAuth, deleteReview);

router.route("/product/reviews")
.get(getProductReviews);

router.route("/product/:id")
.get(getSingleProduct);


export default router;