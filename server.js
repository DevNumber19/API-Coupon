const express = require("express");
const app = express();
const cors = require("cors");
const { port } = require('./app/config/vars')
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const models = require("./app/config/sequelize");
var path = require("path");

app.use(jsonParser);
app.use(urlencodedParser);
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public")));

app.all("", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// models.sequelize
//   .sync()
//   .then(() => {
//     console.log("Database connected");
//   })
//   .catch((err) => {
//     console.log("Database not conecting...", err);
//   });

var couponController = require(path.resolve(__dirname, "./app/controller/couponController.js"));

app.use("/api/", require("./app/routes/route"));

app.route("/landing/:uid").get(couponController.getLanding);

app.route("/coupon/:uid").get(couponController.getCouponCode);

app.route("/openCoupon/:couponId").put(couponController.updateOpenCoupon);

app.route("/redeemCoupon").post(couponController.redeemCoupon);

// app.route("/requestCoupon").post(couponController.requestCoupon);
// app.route("/login").post(couponController.login);

app.listen(port, () => console.log(`listening on port ${port}!`));
