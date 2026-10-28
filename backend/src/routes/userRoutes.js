import express from "express";
import { loginUser, logoutUser, registerUser, resetPassword, resetPasswordRequest } from "../controller/userController.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/login/reset").post(resetPasswordRequest);
router.route("/login/reset/:token").post(resetPassword);

export default router;