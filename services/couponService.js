const factoryHandler = require("./factoryHandler");

const Coupon = require("../models/couponModel");

// @desc  get All Coupons
// @route get /api/v1/Coupons
// @access private /admin-Manger

exports.getCoupons = factoryHandler.getAll(Coupon);

// @desc    get Specific Coupon
// @route   get /api/v1/Coupons/:id
// @access  private /admin-Manger
exports.getOneCoupon = factoryHandler.getOneById(Coupon);

// @desc   Create Coupon
// @route  post /api/v1/Coupons
// @access private /admin-Manger
exports.createCoupon = factoryHandler.createOne(Coupon);

// @desc   Update Coupon
// @route  put /api/v1/Coupons
// @access private /admin-Manger
exports.updateCoupon = factoryHandler.updateOne(Coupon);

// @desc   Delete Coupon
// @route  Delete /api/v1/Coupons
// @access private /admin-Manger
exports.deleteCoupon = factoryHandler.deleteOne(Coupon);
