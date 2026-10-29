import express from "express";
import { deleteUser, getOwnUserDetails, getSingleUser, getUserDetails, getUsersList, loginUser, logoutUser, registerUser, resetPassword, resetPasswordRequest, updatePassword, updateProfile, updateUserRole } from "../controller/userController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(logoutUser);

router.route("/login/reset")
.post(resetPasswordRequest);

router.route("/login/reset/:token").post(resetPassword);

router.route("/profile/:id")
.get(verifyUserAuth, getUserDetails);

router.route("/profile")
.get(verifyUserAuth, getOwnUserDetails);

router.route("/password/update")
.patch(verifyUserAuth, updatePassword);

router.route("/profile/update")
.patch(verifyUserAuth, updateProfile);

router.route("/admin/users")
.get(verifyUserAuth, roleBasedAccess("admin"), getUsersList);

router.route("/admin/user/:id")
.get(verifyUserAuth, roleBasedAccess("admin"), getSingleUser)
.patch(verifyUserAuth, roleBasedAccess("admin"), updateUserRole)
.delete(verifyUserAuth, roleBasedAccess("admin"), deleteUser);

export default router;