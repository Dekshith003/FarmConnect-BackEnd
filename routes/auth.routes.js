const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validateRequest = require("../middlewares/validate.middleware");

const { protect } = require("../middlewares/auth.middleware");
const authService = require("../services/auth.service")();
const ctrl = require("../controllers/auth.controller")({ authService });

// existing routes
router.post(
  "/register",
  [
    body("name").isString().trim().notEmpty(),
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

router.post(
  "/verify-login",
  [
    body("email").isEmail(),
    body("otp").isLength({ min: 6, max: 6 }),
    body("role").isIn(["farmer", "customer"]),
  ],
  validateRequest,
  ctrl.verifyLogin
);

// NEW: forgot password (sends OTP) - public
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
