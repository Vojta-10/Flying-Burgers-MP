const express = require('express');
const router = express.Router();

const { getOrders, makeAnOrder } = require('../controllers/orders');

router.post('/order/make-an-order', makeAnOrder);
router.get('/order/history', getOrders);

module.exports = router;
