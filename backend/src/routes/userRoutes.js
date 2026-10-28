import express from "express";
import { loginUser, logoutUser, registerUser, requestPasswordReset } from "../controller/userController.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/password/reset").post(requestPasswordReset);

export default router;