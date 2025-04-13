const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        name: {
          type: String,
          required: [true, 'Please provide name'],
          trim: true,
        },
        quantity: {
          type: Number,
          required: [true, 'Please provide quantity'],
          min: 1,
        },
        price: {
          type: Number,
          required: [true, 'Please provide price'],
          min: 0,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    deliveryType: {
      type: String,
      enum: ['delivery', 'pickup'],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['card', 'cash'],
      required: true,
    },
    address: {
      type: String,
      default: '',
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
