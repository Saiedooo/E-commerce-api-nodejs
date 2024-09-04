
const factoryHandler = require("./factoryHandler");
const Review = require("../models/reviewModel");

// Nested Route 
// Get /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObj = filterObject;
    next();
  };

// @desc  get All reviews
// @route get /api/v1/reviews
// @acces admin/user

exports.getReviews  =  factoryHandler.getAll(Review);

// @desc    get Specific Review
// @route   get /api/v1/Reviews
// @acces admin/user
exports.getOneReview = factoryHandler.getOneById(Review);

// @desc   Create Review
// @route  post /api/v1/Reviews
// @acces admin/user
exports.createReview = factoryHandler.createOne(Review);

// nested Route
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.product) req.body.product = req.params.productId;
  if(!req.body.user) req.body.user = req.user._id
  next();
};


// @desc   Update Review
// @route  put /api/v1/Reviews
// @acces admin/user
exports.updateReview = factoryHandler.updateOne(Review);

// @desc   Delete Review
// @route  Delete /api/v1/Reviews
// @acces admin/user/manger
exports.deleteReview = factoryHandler.deleteOne(Review);
