const express = require('express');
const router = express.Router();

const { updateAddress, getCurrentUser } = require('../controllers/user');

router.patch('/update-address', updateAddress);
router.get('/me', getCurrentUser);

module.exports = router;
