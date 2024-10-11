const router = require("express").Router();

const couponRoutes = require('./coupon.routes');
const smsRoutes = require('./sms.routes');

router.use('/coupon', couponRoutes);
router.use('/sms', smsRoutes);

module.exports = router;