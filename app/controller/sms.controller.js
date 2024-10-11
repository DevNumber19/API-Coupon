const db = require('../config/sequelize')
const {
    campaignId,
    smartCommSmsUrlFey,
    smartCommSmsUserFey,
    smartCommSmsPasswordFey,
    smartCommSmsUrlFeySender,
    smartCommSmsUserFeySender,
    smartCommSmsPasswordFeySender
} = require('../config/vars')
const axios = require("axios");
const SMSTaskModel = db.smsTask;
const { Op, Sequelize } = require('sequelize');
const urlencode = require('urlencode');
var return_message = require("../util/system_response.js");

exports.sendSms = async (req, res) => {
    let status
    let _message
    try {
        let { mobileNumber, campaign_Id } = req.body

        if(!mobileNumber){
            status = 400;
            _message = "Bad Request";
            system_response_ = new return_message(status, _message);
            return res.status(status).json({ system_response: system_response_, data: 'mobile number not found' });
        }
        if(!campaign_Id){
            status = 400;
            _message = "Bad Request";
            system_response_ = new return_message(status, _message);
            return res.status(status).json({ system_response: system_response_, data: 'campaign id not found' });
        }

        mobileNumber = mobileNumber.toString().trim()

        let isNumber = () => {
            console.log('mobileNumber', mobileNumber)
            console.log('test', /^\d+$/.test(mobileNumber))
            return /^\d+$/.test(mobileNumber);
        }

        let resIsNumber = isNumber()
        console.log('resIsNumber', resIsNumber)

        if(!resIsNumber){
            return res.json({ success: false, message: 'Invalid format mobile number!' });
        }

        const checkCode = await SMSTaskModel.findOne({
            where: {
                campaign_id: campaign_Id,
                // campaign_id: Number(campaignId),
                tel: mobileNumber
            },
            order: [['created_at', 'ASC']]
        })
        if (checkCode) {
            return res.json({ success: false, message: 'Already used!' });
        }
        const couponCode = await SMSTaskModel.findOne({
            where: {
                campaign_id: campaign_Id,
                // campaign_id: Number(campaignId),
                tel: null
            },
            order: [['created_at', 'ASC']]
        })
        console.log('couponCode', couponCode);
        if (!couponCode) {
            return res.json({ success: false, message: 'Coupon sold out!' });
        }
        const message = couponCode.message
        let data = {
            ACCOUNT: smartCommSmsUserFey,
            PASSWORD: smartCommSmsPasswordFey,
            MOBILE: mobileNumber,
            MESSAGE: message,
            OPTION: `SEND_TYPE=General`
        }
        encBody = urlencode.stringify(data, { charset: 'tis620' })
        const config = {
            url: `${smartCommSmsUrlFey}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=tis-620",
            },
        };
        try {
            let resp = await axios.post(smartCommSmsUrlFey, encBody, config)
            console.log('++++ sms ++++', resp);
            couponCode.tel = mobileNumber
            couponCode.provider_response = resp.data
            couponCode.status = 'done'
            await couponCode.save()
        } catch (error) {
            console.log('error :', error);
            return res.json({ success: false, error: error.message });
        }
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
}
exports.sendSmsFey = async (req, res) => {
    let status
    let _message
    try {
        let { mobileNumber, campaign_Id } = req.body

        if(!mobileNumber){
            status = 400;
            _message = "Bad Request";
            system_response_ = new return_message(status, _message);
            return res.status(status).json({ system_response: system_response_, data: 'mobile number not found' });
        }
        if(!campaign_Id){
            status = 400;
            _message = "Bad Request";
            system_response_ = new return_message(status, _message);
            return res.status(status).json({ system_response: system_response_, data: 'campaign id not found' });
        }

        mobileNumber = mobileNumber.toString().trim()

        let isNumber = () => {
            console.log('mobileNumber', mobileNumber)
            console.log('test', /^\d+$/.test(mobileNumber))
            return /^\d+$/.test(mobileNumber);
        }

        let resIsNumber = isNumber()
        console.log('resIsNumber', resIsNumber)

        if(!resIsNumber){
            return res.json({ success: false, message: 'Invalid format mobile number!' });
        }

        const checkCode = await SMSTaskModel.findOne({
            where: {
                campaign_id: campaign_Id,
                // campaign_id: Number(campaignId),
                tel: mobileNumber
            },
            order: [['created_at', 'ASC']]
        })
        if (checkCode) {
            return res.json({ success: false, message: 'Already used!' });
        }
        const couponCode = await SMSTaskModel.findOne({
            where: {
                campaign_id: campaign_Id,
                // campaign_id: Number(campaignId),
                tel: null
            },
            order: [['created_at', 'ASC']]
        })
        console.log('couponCode', couponCode);
        if (!couponCode) {
            return res.json({ success: false, message: 'Coupon sold out!' });
        }
        const message = couponCode.message
        let data = {
            ACCOUNT: smartCommSmsUserFeySender,
            PASSWORD: smartCommSmsPasswordFeySender,
            MOBILE: mobileNumber,
            MESSAGE: message,
            OPTION: `SEND_TYPE=General`
        }
        console.log('++++ sms dataddddd ++++', data);
        encBody = urlencode.stringify(data, { charset: 'tis620' })
        const config = {
            url: `${smartCommSmsUrlFeySender}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=tis-620",
            },
        };
        console.log('++++ sms ++++', config);
        try {
            let resp = await axios.post(smartCommSmsUrlFeySender, encBody, config)
            // console.log('++++ sms ++++', resp);
            couponCode.tel = mobileNumber
            couponCode.provider_response = resp.data
            couponCode.status = 'done'
            await couponCode.save()
        } catch (error) {
            console.log('error :', error);
            return res.json({ success: false, error: error.message });
        }
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
}
