import express from "express";
import { getOwnUserDetails, getUserDetails, loginUser, logoutUser, registerUser, resetPassword, resetPasswordRequest, updatePassword, updateProfile } from "../controller/userController.js";
import { verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/login/reset").post(resetPasswordRequest);
router.route("/login/reset/:token").post(resetPassword);
router.route("/profile/:id").get(verifyUserAuth, getUserDetails);
router.route("/profile").post(verifyUserAuth, getOwnUserDetails);
router.route("/password/update").post(verifyUserAuth, updatePassword);
router.route("/profile/update").patch(verifyUserAuth, updateProfile);

export default router;