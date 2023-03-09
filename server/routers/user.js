const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();

router.get("/account", userController.getAllAccount);
router.put("/status/:userId", userController.changeStatus);
router.put("/rank/:userId", userController.changeRank);
router.get("/:id/info", userController.getUserById);
router.put("/:id/info", userController.updateUserInfo);
router.post("/get/base64", userController.getBase64);
router.put("/password/:userId", userController.changeUserPassword);
router.post("/check-email", userController.checkEmailExist);
router.post("/send-otp", userController.sendOtp);
router.post("/confirm-otp", userController.confirmOtp);
router.post("/change-forgot-password", userController.changeForgotPassword);

module.exports = router;
