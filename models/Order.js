const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  propertyId: { type: String, required: true },
  userId: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // You can customize the possible order statuses
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
