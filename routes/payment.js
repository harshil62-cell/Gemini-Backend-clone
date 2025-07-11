
const express = require('express');
const router = express.Router();
const validateToken = require('../middlewares/validateTokenHandler');
const {subscribePro,getSubscriptionStatus} = require('../controllers/paymentController');

router.post('/subscribe/pro', validateToken, subscribePro);
router.get('/subscription/status', validateToken, getSubscriptionStatus);

module.exports = router;
