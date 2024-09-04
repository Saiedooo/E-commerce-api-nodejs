const express = require("express");

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validator/reviewValidator");

const {
  getReviews,
  getOneReview,
  createReview,
  deleteReview,
  updateReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} = require("../services/reviewServices");

const router = express.Router({ mergeParams: true });

const authService = require("../services/authService");

router
  .route("/")
  .get(createFilterObj, getReviews)

  .post(
    authService.protect,
    authService.allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .get(getReviewValidator, getOneReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "user", "manager"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
