const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const WishlistController = require("../controllers/wishlist.controller");
const wishlistController = new WishlistController();

router.post(
  "/add",
  protect,
  wishlistController.addToWishlist.bind(wishlistController)
);
router.get(
  "/",
  protect,
  wishlistController.getWishlist.bind(wishlistController)
);
router.delete(
  "/remove",
  protect,
  wishlistController.removeFromWishlist.bind(wishlistController)
);

module.exports = router;
