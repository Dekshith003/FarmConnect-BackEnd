// Wishlist Controller
class WishlistController {
  constructor(customerRepo) {
    this.customerRepo = customerRepo;
  }

  async addToWishlist(req, res, next) {
    // Stub: add cropId to user's wishlist
    try {
      // Implement DB logic later
      res.json({ message: "Added to wishlist (stub)" });
    } catch (err) {
      next(err);
    }
  }

  async getWishlist(req, res, next) {
    // Stub: get user's wishlist
    try {
      res.json({ wishlist: [] });
    } catch (err) {
      next(err);
    }
  }

  async removeFromWishlist(req, res, next) {
    // Stub: remove cropId from user's wishlist
    try {
      res.json({ message: "Removed from wishlist (stub)" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = WishlistController;
