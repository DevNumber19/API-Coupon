var express = require('express');

var router = express.Router();
const controller = require('../controller/sms.controller');

router.route('/send')
    .post(controller.sendSms)

router.route('/sendFey')
    .post(controller.sendSmsFey)

module.exports = router