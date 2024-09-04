const express = require("express");

const {
  getCoupons,
  getOneCoupon,
  updateCoupon,
  deleteCoupon,
  createCoupon,
} = require("../services/couponService");

const router = express.Router();

const authService = require("../services/authService");

router.use(authService.protect, authService.allowedTo("admin", "manger"));

router.route("/").get(getCoupons).post(createCoupon);

router.route("/:id").get(getOneCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
