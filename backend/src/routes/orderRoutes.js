import express from "express";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";
import { createNewOrder, getAllMyOrders, getAllOrders, getSingleOrder, updateOrderStatus } from "../controller/orderController.js";

const router = express.Router();

router.route("/order/new").post(verifyUserAuth, createNewOrder);
router.route("/orders/me").get(verifyUserAuth, getAllMyOrders);

router.route("/admin/order/:id")
.get(verifyUserAuth, roleBasedAccess("admin"), getSingleOrder)
.put(verifyUserAuth, roleBasedAccess("admin"), updateOrderStatus);

router.route("/admin/orders").get(verifyUserAuth, roleBasedAccess("admin"), getAllOrders);

export default router;