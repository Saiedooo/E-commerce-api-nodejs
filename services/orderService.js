const asyncHandler = require("express-async-handler");
const factoryHandler = require("./factoryHandler");
const ApiError = require("../utils/apiError");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

// @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  Protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.priceAfterDiscout
    ? cart.priceAfterDiscout
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default paymentMethodType cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "success", data: order });
});

// @desc    get all order for log user
// @route   POST /api/v1/orders
// @access  Protected/User
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

// @desc    get all order
// @route   POST /api/v1/orders
// @access  Protected/User
exports.findAllorders = factoryHandler.getAll(Order);

// @desc    get specefic order
// @route   POST /api/v1/orders
// @access  Protected/User
exports.findSpecificOrder = factoryHandler.getOneById(Order);

// @desc   update orderPaid status
// @route   put /api/v1/orders/:orderId/pay
// @access  Protected/User
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedData = await order.save();
  res.status(201).json({ status: "success", Data: updatedData });
});

// @desc   update order Delivered status
// @route   put /api/v1/orders/:orderId/Delever
// @access  Protected/User
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }
  order.isDelivered = true;
  order.deliverdAt = Date.now();

  const updatedData = await order.save();
  res.status(201).json({ status: "success", Data: updatedData });
});

// @desc    get checkout session from and it as response
// @route   put /api/v1/orders/checkout-session/cartId
// @access  Protected/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.priceAfterDiscout
    ? cart.priceAfterDiscout
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // Create a price object or retrieve a price ID if you already have one
  const priceData = {
    currency: "egp",
    product_data: {
      name: req.user.name,
    },
    unit_amount: totalOrderPrice * 100, // Stripe expects the amount in the smallest currency unit
  };

  // 3) create Stripe session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: priceData,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) send Session to response
  res.status(200).json({ status: "Success", session });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total/ 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne(session.customer_email);
  // 3) Create order with default paymentMethodType cash
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });
  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }

  res.status(201).json({ status: "success", data: order });
};
// @desc    this webhook will run when write Payment Succsefully
// @route   post /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`webhook Error ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    // Create Order
    createCardOrder(event.data.object);
  }
  res.status(200).json({ received: true });
});
