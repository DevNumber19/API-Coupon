var express = require('express');

var router = express.Router();
const controller = require('../controller/coupon.controller');

router.route('')
    .get(controller.getCoupons)

router.route('/detail/:couponId')
    .get(controller.getCouponDetail)

router.route('/opened')
    .post(controller.openCoupon)

router.route('/redeem')
    .post(controller.redeem)

router.route('/redeemNew')
    .post(controller.redeemNew)

router.route('/checkRedeem/:couponCodeId')
    .get(controller.checkRedeem)

router.route('/checkRedeemNew/:couponCodeId')
    .get(controller.checkRedeemNew)

router.route('/all')
    .get(controller.getCouponAllForSelect)

router.route('/checkRedeem/limit/:couponCodeId')
    .get(controller.checkRedeemByLimitCampaign)

router.route('/redeem/limit')
    .post(controller.redeemByLimitCampaign)

router.route('/redeemNew/coupon')
    .post(controller.redeemAndSendCoupon)
    

module.exports = router