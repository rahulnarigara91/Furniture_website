const express = require("express");
const app = express();
const router = require("express").Router();
const config = require("./configs");
const jwt = require("jsonwebtoken");
const authorize = require("./authorization-middleware");
const route = require("./routes/product");
const cors = require("cors");

// Import routes
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/userRoute");

// Middlewares
app.use(express.json());
app.use(cors());

app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    response.header("Access-Control-Allow-Headers", " x-auth-token, Access-Control-Allow-Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Authorization, WWW-Authenticate, x-api-key");
    next();
})

// route Middlewares
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);


//app.use("/api/authController",productRoutes);
//app.use("/api/login",userRoutes);

//tset route for route protect authentication
// const auth = require("./controllers/authController");
// app.post("/authenticate", auth, (req, res) => {
//   res.status(200).send("Welcome");
// });

//app.use("/api/signup", userController.signup);

//start
app.get("/token", (req, res) => {
  const payload = {
    name: "sejal",
    scopes: "customer:read"
  };

  const token = jwt.sign(payload, config.JWT_SECRET);
  res.send(token);
});

app.get("/product", authorize("customer:read"), (req, res) => {
  res.send("product Information");
});
app.get("/product_create", authorize("customer:read"), (req, res) => {
  res.send("product create");
});
//end
module.exports = app;