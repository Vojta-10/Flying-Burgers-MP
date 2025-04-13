const Order = require('../models/Order');
const { StatusCodes } = require('http-status-codes');

const makeAnOrder = async (req, res) => {
  const { items, address, deliveryType } = req.body;

  if (!items || items.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Cart is empty.' });
  }

  if (deliveryType === 'delivery' && !address) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Delivery address is required.' });
  }

  const order = await Order.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ order });
};

const getOrders = async (req, res) => {
  const orders = await Order.find({
    user: req.user.userId,
  });
  res.status(StatusCodes.OK).json({ orders });
};

module.exports = { makeAnOrder, getOrders };
