//const express = require("express");
const {getConnect,closeConnection} =  require('./db/index') 
//const app = express();
const app = require('./app');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");


getConnect();

// Import routes
//const productRoutes = require("./routes/product");

// Middlewares
// app.use(express.json());
// app.use(cors());

// // route Middlewares
// app.use("/api/products", productRoutes);

app.listen(4000, () => console.log("server up and runing on port 4000!"));
