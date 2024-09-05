const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require('compression')
const  rateLimit  = require('express-rate-limit')
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require("xss");

dotenv.config({ path: "config.env" });

const ApiError = require("./utils/apiError");
const globalError = require("./middleWares/errorMiddleWare");
const dbConnection = require("./config/database");
// Routes

const MountRoutes = require("./routes");
const { webhookCheckout} = require('./services/orderService')

// Express app

const app = express();
app.use(cors());
app.options('*',cors())

// Enable Other domains to access Your application
app.use(compression());

// Checkout webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

// MiddleWares
app.use(express.json({limit:"20kb"}));
app.use(express.static(path.join(__dirname, "uploads")));

// Development Mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}


// To Apply data santization mongo injection
// app.use(mongoSanitize());
// app.use(xss());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
  message:
   'Too many accounts created from this Ip,please try again after an hour'

})

// Apply the rate limiting middleware to all requests.
app.use('/api',limiter)
// middlewares to parameter against http Parameter Pollution attacks
app.use(hpp({wishlist:['price','sold','quantity','ratingAverage','ratingQuantity']}))



// Db connection
dbConnection();

// MountRoutes
MountRoutes(app);
// handlling any error route
app.all("*", (req, res, next) => {
  next(new ApiError(`Cant find this Route ${req.originalUrl} `, 400));
});

// error handling middleWare
// global error handling midlleWare
// catch error back from express
app.use(globalError);

// PORT
const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, () => {
  console.log(`App running on PORT: ${PORT} ....`);
});

// handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Errors ${err.name} |  ${err.message}`);
  server.close(() => {
    console.log("Shutting Down.......");
    process.exit(1);
  });
});
