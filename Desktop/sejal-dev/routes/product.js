const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
// const authorize = require("../authorization-middleware");
// const authController = require('../controllers/authController');

router.post("/", productController.product_create);
router.get("/", productController.product_all);
router.get("/:productId", productController.product_details);
router.put("/:productId", productController.product_update);
router.delete("/:productId", productController.product_delete);

//router.use(authController.protect);

//router.post('/',authController.product_create);
//app.use("/api/authenticate", productRoutes);
module.exports = router;

