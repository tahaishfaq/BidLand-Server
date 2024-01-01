const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    // Retrieve relevant information from the request body
    const { sessionId, propertyId, userId, totalPrice, paymentMethod } = req.body;

    // Create a new order in your database
    const order = new Order({
      sessionId,
      propertyId,
      userId,
      totalPrice,
      paymentMethod,
      status: 'Completed', // You may want to include additional order status information
    });

    // Save the order to your database
    await order.save();

    // Respond with a success message
    res.status(200).json({ message: 'Order successfully created' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();

    // Respond with the list of orders
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
};
