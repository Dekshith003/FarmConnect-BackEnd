const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validateRequest = require("../middlewares/validate.middleware");

const { protect } = require("../middlewares/auth.middleware");
const authService = require("../services/auth.service")();
const ctrl = require("../controllers/auth.controller")({ authService });

// Logout (client should just delete token, but endpoint for completeness)
router.post("/logout", (req, res) => {
  // For stateless JWT, logout is handled on client by deleting token.
  // Optionally, you could implement token blacklisting here.
  res.status(200).json({ message: "Logged out successfully" });
});

// existing routes
router.post(
  "/register",
  [
    body("firstName").isString().trim().notEmpty(),
    body("lastName").isString().trim().notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["farmer", "customer"]),
  ],
  validateRequest,
  ctrl.register
);

router.post(
  "/verify-registration",
  [
    body("email").isEmail(),
    body("otp").isLength({ min: 6, max: 6 }),
    body("role").isIn(["farmer", "customer"]),
  ],
  validateRequest,
  ctrl.verifyRegistration
);

// POST /login (email/password, returns token)
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").isString().notEmpty(),
    body("role").isIn(["farmer", "customer"]),
  ],
  validateRequest,
  ctrl.login
);
// NEW: forgot password - public
router.post(
  "/forgot-password",
  [body("email").isEmail(), body("role").isIn(["farmer", "customer"])],
  validateRequest,
  ctrl.forgotPassword
);

// NEW: reset password - public (OTP)
router.post(
  "/reset-password",
  [
    body("email").isEmail(),
    body("otp").isLength({ min: 6, max: 6 }),
    body("role").isIn(["farmer", "customer"]),
    body("newPassword").isLength({ min: 6 }),
  ],
  validateRequest,
  ctrl.resetPassword
);

// NEW: change password - protected
router.post(
  "/change-password",
  protect,
  [
    body("oldPassword").isLength({ min: 6 }),
    body("newPassword").isLength({ min: 6 }),
  ],
  validateRequest,
  ctrl.changePassword
);

module.exports = router;
