const express = require('express');
const router = express.Router();

const { getOrders, makeAnOrder } = require('../controllers/orders');

router.post('/make-an-order', makeAnOrder);
router.get('/history', getOrders);

module.exports = router;
