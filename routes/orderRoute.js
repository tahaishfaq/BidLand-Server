const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Endpoint to handle creating orders
router.post('/create', orderController.createOrder);
router.get('/getallorders/:userId', orderController.getAllOrders);

module.exports = router;
