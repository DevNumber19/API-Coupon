const db = require('../config/sequelize')
const couponModel = db.coupon;
const couponCodeModel = db.coupon_code;
const companyModel = db.companies;
const campaignModel = db.campaigns;
const SMSTaskModel = db.smsTask;
const sequelize = db.sequelize;
const { Op, Sequelize } = require('sequelize');
const qs = require("qs");
const { campaignId } = require('../config/vars')
const { UniqueString } = require('unique-string-generator');
var return_message = require("../util/system_response.js");

exports.getCoupons = async (req, res) => {
    try {
        const { campaignCode, uid } = req.query
        const campaign = await campaignModel.findOne({ where: { campaign_ref: campaignCode } });
        const couponCode = await couponCodeModel.findAll({
            where: {
                campaign_id: campaign.id,
                uid: uid
            },
            include: [
                { model: couponModel }
            ],
            attributes: { exclude: ['coupon_code'] }
        })
        const SMSTask = await SMSTaskModel.findOne({ where: { uid: uid } });
        res.json({ success: true, data: couponCode, sms: SMSTask });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
}

exports.getCouponDetail = async (req, res) => {
    try {
        const { couponId } = req.params;
        const coupon = await couponModel.findOne({
            where: {
                id: couponId
            }
        })
        res.json({ success: true, data: coupon });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }

}

exports.openCoupon = async (req, res) => {
    try {
        const { couponCodeId } = req.body;
        //const campaign = await campaignModel.findOne({ where: { campaign_ref: campaignCode } });
        const couponCode = await couponCodeModel.findOne({
            where: {
                id: couponCodeId
                // campaign_id: campaign.id,
                // uid: uid,
                // coupon_id: couponId
            }
        })
        if (couponCode === null) {
            return res.json({ success: false });
        }


        if (couponCode !== null && couponCode.opened_at === null) {
            couponCode.opened_at = new Date();
            await couponCode.save();
        }
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }

}

exports.redeem = async (req, res) => {
    try {
        const { couponCodeId } = req.body;
        // const campaign = await campaignModel.findOne({ where: { campaign_ref: campaignCode } });
        const couponCode = await couponCodeModel.findOne({
            where: {
                id: couponCodeId
                // campaign_id: campaign.id,
                // uid: uid,
                // coupon_id: couponId
            }
        })
        if (couponCode === null) {
            return res.json({ success: false });
        }
        if (couponCode !== null && couponCode.redeemed_at === null) {
            couponCode.redeemed_at = new Date();
            await couponCode.save();
        }
        res.json({ success: true, data: couponCode });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }

}

exports.redeemNew = async (req, res) => {
    try {
        const { couponCodeId } = req.body;
        const couponCode = await couponCodeModel.findOne({
            where: {
                id: couponCodeId
                // campaign_id: campaign.id,
                // uid: uid,
                // coupon_id: couponId
            }
        })
        if (couponCode === null) {
            return res.json({ success: false });
        }

        let campaign = await campaignModel.findOne({ where: { id: couponCode.campaign_id } });
        let countRedeem = await couponCodeModel.count({
            where: {
                campaign_id: couponCode.campaign_id,
                uid: couponCode.uid,
                redeemed_at: { [Op.not]: null }
            }
        })
        if (campaign.limit_redeem <= countRedeem) {
            return res.json({ success: false, message: "already redeemed !" });
        }
        if (couponCode !== null && couponCode.redeemed_at === null) {
            couponCode.redeemed_at = new Date();
            await couponCode.save();

            let countCode = await couponCodeModel.count({
                where: {
                    campaign_id: couponCode.campaign_id,
                    uid: couponCode.uid,
                    redeemed_at: { [Op.not]: null }
                }
            })
            if (campaign.limit_redeem <= countCode) {
                await couponCodeModel.update({ is_disable: true }, {
                    where: {
                        campaign_id: couponCode.campaign_id,
                        uid: couponCode.uid,
                        redeemed_at: null
                    }
                })
            }
        }
        res.json({ success: true, data: couponCode });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }

}

exports.checkRedeem = async (req, res) => {
    try {
        const { couponCodeId } = req.params;
        const couponCode = await couponCodeModel.findOne({
            where: {
                id: couponCodeId
            }
        })
        if (couponCode === null) {
            return res.json({ success: "no data" });
        }
        if (couponCode !== null && couponCode.redeemed_at === null) {
            res.json({ success: true, is_redeem: false });
        }
        else {
            res.json({ success: true, is_redeem: true });
        }
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
}

exports.checkRedeemNew = async (req, res) => {
    try {
        const { couponCodeId } = req.params;
        const couponCode = await couponCodeModel.findOne({
            where: {
                id: couponCodeId
            }
        })
        if (couponCode === null) {
            return res.json({ success: "no data" });
        }
        let campaign = await campaignModel.findOne({ where: { id: couponCode.campaign_id } });
        let countRedeem = await couponCodeModel.count({
            where: {
                campaign_id: couponCode.campaign_id,
                uid: couponCode.uid,
                redeemed_at: { [Op.not]: null }
            }
        })
        if (campaign.limit_redeem <= countRedeem) {
            return res.json({ success: false, is_redeem: false, message: "already redeemed !" });
        }
        if (couponCode !== null && couponCode.redeemed_at !== null) {
            return res.json({ success: true, is_redeem: false });
        }
        res.json({ success: true, is_redeem: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
}

// for show coupon before stamp used code by campaignID  ex. 99999,99998,99997
exports.getCouponAllForSelect = async (req, res) => {
    let status
    let message
    try {
        const { campaignRef } = req.query
        if (!campaignRef) {
            status = 400;
            message = "Bad Request";
            system_response_ = new return_message(status, message);
            return res.status(status).json({ system_response: system_response_, data: 'campaign Ref not found' });
        }
        const campaign = await campaignModel.findOne({
            where: {
                campaign_ref: campaignRef
            }
        })
        if (!campaign) {
            status = 400;
            message = "Bad Request";
            system_response_ = new return_message(status, message);
            return res.status(status).json({ system_response: system_response_, data: 'campaign not found' });
        }

        const company = await companyModel.findOne({
            where: {
                id: campaign.company_id
            }
        })
        if (!company) {
            status = 400;
            message = "Bad Request";
            system_response_ = new return_message(status, message);
            return res.status(status).json({ system_response: system_response_, data: 'company not found' });
        }

        const coupon = await couponModel.findAll({
            where: {
                campaign_id: campaign.id
                // campaign_id: [campaignId]
            },
            include: [
                {
                    model: couponCodeModel,
                    as: 'couponCodes',
                    where: {
                        uid: null
                    },
                    attributes: [[sequelize.fn('COUNT', 'couponCodes.id'), 'Count']],
                    required: false
                    // attributes: [[models.sequelize.fn('COUNT', 'id'), 'items']]
                },
            ],
            group: ['couponCodes.coupon_id']
        })
        res.json({ success: true, data: coupon, logo_img: company.logo_url });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
}

exports.checkRedeemByLimitCampaign = async (req, res) => {
    try {
        const { couponCodeId } = req.params;
        const { uid } = req.query
        const couponCode = await couponCodeModel.findOne({
            where: {
                coupon_id: couponCodeId,
                uid: null,
                // campaign_id: campaignId
            }
        })
        if (couponCode === null) {
            return res.json({ success: "fully redeemed !" });
        }
        let campaign = await campaignModel.findOne({ where: { id: couponCode.campaign_id } });
        // let campaign = await campaignModel.findOne({ where: { id: campaignId } });
        let countRedeem = await couponCodeModel.count({
            where: {
                campaign_id: couponCode.campaign_id,
                uid: uid,
                // redeemed_at: { [Op.not]: null }
            }
        })
        console.log('countRedeem', countRedeem);
        console.log('campaign', campaign);
        if (campaign.limit_redeem <= countRedeem) {
            return res.json({ success: false, is_redeem: false, message: "already redeemed !" });
        }
        if (couponCode !== null && couponCode.redeemed_at !== null) {
            return res.json({ success: true, is_redeem: false });
        }
        return res.json({ success: true, is_redeem: true });
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

exports.redeemByLimitCampaign = async (req, res) => {
    let status
    let message
    try {
        const { couponCodeId, campaignId, uid } = req.body;

        const campaign = await campaignModel.findOne({
            where: {
                id: campaignId
            }
        })
        if (!campaign) {
            status = 400;
            message = "Bad Request";
            system_response_ = new return_message(status, message);
            res.status(status).json({ system_response: system_response_, data: {} });
        }

        let countRedeem = await couponCodeModel.count({
            where: {
                campaign_id: campaignId,
                uid: uid,
                redeemed_at: { [Op.not]: null }
            }
        })

        if (campaign.limit_redeem <= countRedeem) {
            return res.json({ success: false, is_redeem: false, message: "Fully redeemed !" });
        }

        const couponCode = await couponCodeModel.findOne({
            where: {
                coupon_id: couponCodeId,
                campaign_id: campaignId,
                // uid: uid,
                redeemed_at: null
            },
        })
        console.log('couponCode', couponCode);
        if (!couponCode) {
            status = 400;
            message = "data not found";
            system_response_ = new return_message(status, message);
            return res.status(status).json({ system_response: system_response_, data: {} });
        }


        if (couponCode !== null && couponCode.redeemed_at === null) {
            couponCode.uid = uid;
            couponCode.is_disable = 1;
            couponCode.redeemed_at = new Date();
            await couponCode.save();

            let countCode = await couponCodeModel.count({
                where: {
                    campaign_id: campaignId,
                    uid: uid,
                    redeemed_at: { [Op.not]: null }
                }
            })
            if (campaign.limit_redeem <= countCode) {
                await couponCodeModel.update({ is_disable: true }, {
                    where: {
                        campaign_id: campaignId,
                        uid: uid,
                        redeemed_at: null
                    }
                })
            }
        }

        status = 200;
        return res.status(status).json({ success: true, data: couponCode });
    } catch (error) {
        return res.status(422).json({ success: false, error: error.message });
    }

}


exports.redeemAndSendCoupon = async (req, res) => {
    let status
    let _message
    try {
        let { mobileNumber, campaign_Id } = req.body

        if (!mobileNumber) {
            status = 400;
            _message = "Bad Request";
            system_response_ = new return_message(status, _message);
            return res.status(status).json({ system_response: system_response_, data: 'mobile number not found' });
        }
        if (!campaign_Id) {
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

        if (!resIsNumber) {
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
        const smsTask = await SMSTaskModel.findOne({
            where: {
                campaign_id: campaign_Id,
                // campaign_id: Number(campaignId),
                tel: null
            },
            order: [['created_at', 'ASC']]
        })
        console.log('smsTask', smsTask);
        if (!smsTask) {
            return res.json({ success: false, message: 'Coupon sold out!' });
        }

        try {

            //flow redeem
            const campaignId = smsTask.campaign_id;
            const coupon = await couponModel.findOne({
                where: {
                    campaign_id: campaignId
                }
            })
            if (!coupon) {
                return res.json({ success: false, message: 'Coupon not found!' });
            }
            const couponCodeId = coupon.id;
            const uid = smsTask.uid
            const couponCode = await couponCodeModel.findOne({
                where: {
                    coupon_id: couponCodeId,
                    uid: null,
                    campaign_id: campaignId,
                    redeemed_at: null
                }
            })
            if (couponCode === null) {
                return res.json({ success: false, message: "fully redeemed !" });
            }
            const campaign = await campaignModel.findOne({ where: { id: couponCode.campaign_id } });
            if (!campaign) {
                return res.json({ success: false, message: 'Campaign not found !' });
            }

            let countRedeem = await couponCodeModel.count({
                where: {
                    campaign_id: campaignId,
                    uid: uid,
                    redeemed_at: { [Op.not]: null }
                }
            })
            if (campaign.limit_redeem <= countRedeem) {
                return res.json({ success: false, is_redeem: false, message: "Fully redeemed !" });
            }


            if (couponCode !== null && couponCode.redeemed_at === null) {
                smsTask.message = 'redeemed';
                smsTask.tel = mobileNumber;
                smsTask.status = 'done';
                await smsTask.save();

                couponCode.uid = uid;
                couponCode.is_disable = 1;
                couponCode.redeemed_at = new Date();
                await couponCode.save();

                let countCode = await couponCodeModel.count({
                    where: {
                        campaign_id: campaignId,
                        uid: uid,
                        redeemed_at: { [Op.not]: null }
                    }
                })
                if (campaign.limit_redeem <= countCode) {
                    await couponCodeModel.update({ is_disable: true }, {
                        where: {
                            campaign_id: campaignId,
                            uid: uid,
                            redeemed_at: null
                        }
                    })
                }
            }
            console.log('couponCode.coupon_code', couponCode.coupon_code)

            return res.status(200).json({ success: true, data: couponCode.coupon_code });

        } catch (error) {
            console.log('error :', error);
            return res.json({ success: false, error: error.message });
        }
        // res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
}