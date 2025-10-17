const Order = require('../models/orderModel');

exports.createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;
    const userId = req.user ? req.user._id : null;
    const order = new Order({ user: userId, items, total, status: 'confirmed' });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product').populate('user').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
