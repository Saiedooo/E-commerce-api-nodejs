const express = require("express");

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishsList,
} = require("../services/wishlistService");

const router = express.Router();

const authService = require("../services/authService");

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishsList);

router.delete("/:productId", removeProductFromWishlist);

module.exports = router;
