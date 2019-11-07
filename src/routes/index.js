const router = require('express').Router();

const payment = require('./payment.route');
const pay = require('./pay.route');

router.use('/payment', payment);
router.use('/pay', pay);

module.exports = router