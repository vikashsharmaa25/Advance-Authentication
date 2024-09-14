const {
  registerUser,
  verifyOtp,
  loginUser,
  resendOtp,
  forgotPassword,
  resetPassword,
  logoutUser,
  getUserProfile,
} = require("../controllers/auth.controller");
const { tokenVerfiyMiddleware } = require("../middleware/auth.middleware");

const router = require("express").Router();

router.post("/user/register", registerUser);
router.post("/user/verify-otp", verifyOtp);
router.post("/user/resend-otp", resendOtp);
router.post("/user/forgot-password", forgotPassword);
router.post("/user/reset-password", resetPassword);
router.post("/user/login", loginUser);
router.get("/user/logout", logoutUser);
router.get("/user/profile/:id", tokenVerfiyMiddleware, getUserProfile);

module.exports = router;
