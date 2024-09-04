const express = require("express");

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validator/productValidator");

const {
  getProducts,
  createProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
  resizeProductImages,
  uploadProductImages,
} = require("../services/productServices");

const reviewRoute = require("../routes/reviewRoute");

const router = express.Router();
// Nested Route
router.use("/:productId/reviews", reviewRoute);

const authService = require("../services/authService");
router
  .route("/")
  .get(getProducts)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manger"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getOneProduct)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manger"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
