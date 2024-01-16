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
  const userId = req.params.userId;

  try {
    // Fetch orders for the specified user from the database
    const orders = await Order.find({ userId });

    // Respond with the list of orders for the user
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
};
