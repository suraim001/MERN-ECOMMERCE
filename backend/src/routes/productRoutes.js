import express from 'express';
import { createProducts, createReviewForProduct, deleteProduct, getAdminProducts, getAllProducts, getSingleProduct, updateProduct } from '../controller/productController.js';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';

const router = express.Router();

// Routes
router.route("/status")
.get((req,res) => res.status(200).send("Server is Live!"));

router.route("/products")
.get(getAllProducts);

router.route("/admin/products")
.get(verifyUserAuth, roleBasedAccess("admin"), getAdminProducts);

router.route("/admin/product/create").post(verifyUserAuth, roleBasedAccess("admin"),  createProducts);

router.route("/admin/product/:id")
.patch(verifyUserAuth, roleBasedAccess("admin"), updateProduct)
.delete(verifyUserAuth, roleBasedAccess("admin"), deleteProduct);

router.route("/product/:id").get(getSingleProduct);

router.route("/product/review/:id").put(verifyUserAuth,createReviewForProduct);

export default router;