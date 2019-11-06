const router = require('express').Router();

const payment = require('./payment.route')

router.use('/payment', payment);

module.exports = router