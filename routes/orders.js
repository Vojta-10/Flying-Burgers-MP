const express = require('express');
const router = express.Router();

const { getOrders, makeAnOrder } = require('../controllers/orders');

router.post('/order', makeAnOrder);
router.get('/order-history', getOrders);

module.exports = router;
