const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updatespeceficQuantity,
  applyCoupon,
} = require("../services/cartService");

const authService = require("../services/authService");
const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .get(getLoggedUserCart)
  .post(addProductToCart)
  .delete(clearCart);

  router.put("/applyCoupon", applyCoupon);


router
  .route("/:itemId")
  .put(updatespeceficQuantity)
  .delete(removeSpecificCartItem);

  

module.exports = router;
