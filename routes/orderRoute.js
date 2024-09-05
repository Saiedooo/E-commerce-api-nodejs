const express = require("express");

const {
  createCashOrder,
  findAllorders,
  filterOrderForLoggedUser,
  findSpecificOrder,
  updateOrderToDelivered,
  updateOrderToPaid,
  checkoutSession
} = require("../services/orderService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.get('/checkout-session/:cartId',authService.allowedTo("user"),checkoutSession)

router.route("/:cartId").post( authService.allowedTo("user"),createCashOrder);
router
  .route("/")
  .get(
    authService.allowedTo("user","admin", "manger"),
    filterOrderForLoggedUser,
    findAllorders
  );

router.route("/:id").get(findSpecificOrder);
router.put('/:id/pay', authService.allowedTo("admin", "manger"),updateOrderToPaid)
router.put('/:id/deliver',authService.allowedTo("admin", "manger"),updateOrderToDelivered)


module.exports = router;
