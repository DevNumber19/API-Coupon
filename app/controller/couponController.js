`user strict`;
var return_message = require("../util/system_response.js");
var sql = require("../util/sql_connect.js");
const { appUrl } = require("../config/vars");

exports.getLanding = async function (req, res) {
    const uid = req.params.uid;
    if (typeof uid === "undefined") {
        message = "Bad Request";
        system_response_ = new return_message(status, message);
        res.status(400).json({ system_response: system_response_, data: {} });
    } else {
        var message;
        let system_response_;
        await getUser(uid)
            .catch(function (err) {
                message = err;
                system_response_ = new return_message(400, message);
                return res.status(422).json({ system_response: system_response_, data: {} });
            })
            .then(async function (result) {
                if (!result) {
                    message = "data not found";
                    system_response_ = new return_message(422, message);
                    return res.status(422).json({ system_response: system_response_ });
                }
                delete result.id
                delete result.coupon_id
                result.coupon_image = `${appUrl}/uploads/${result.coupon_image}`;
                message = "success";
                system_response_ = new return_message(422, message);
                return res.status(200).json({ system_response: system_response_, data: result });
            });
    }
};


exports.getCouponCode = async function (req, res) {
    const uid = req.params.uid;
    if (typeof uid === "undefined") {
        status = 400;
        message = "Bad Request";
        system_response_ = new return_message(status, message);
        res.status(status).json({ system_response: system_response_, data: {} });
    } else {
        var message;
        var status;
        let system_response_;
        await getCoupon(uid)
            .catch(function (err) {
                status = 422;
                message = err;
                system_response_ = new return_message(status, message);
                return res.status(status).json({ system_response: system_response_, data: {} });
            })
            .then(async function (result) {
                if (result) {
                    delete result.coupon_id
                }
                status = 200;
                message = "success";
                system_response_ = new return_message(status, message);
                return res.status(status).json({ system_response: system_response_, data: result });
            });
    }
};

exports.redeemCoupon = async function (req, res) {
    const { uid } = req.body;
    if (typeof uid === "undefined") {
        status = 400;
        message = "Bad Request";
        _data = {};
        system_response = new return_message(status, message);
        res.status(status).json({ system_response: system_response, data: {} });
    } else {
        var message, status, system_response;
        await updateRedeem(uid).catch((err) => {
            status = 422;
            message = err.message;
            system_response = new return_message(status, message);
            return res.status(status).json({ system_response: system_response });
        });
        status = 200;
        message = "success";
        system_response = new return_message(status, message);
        return res.status(status).json({ system_response: system_response });
    }
};


exports.updateOpenCoupon = async function (req, res) {
    const couponId = req.params.couponId;
    if (typeof couponId === "undefined") {
        status = 400;
        message = "Bad Request";
        system_response_ = new return_message(status, message);
        res.status(status).json({ system_response: system_response_, data: {} });
    } else {
        var message;
        var status;
        let system_response_;
        await updateOpenLanding(couponId).catch(function (err) {
            status = 422;
            message = err;
            system_response_ = new return_message(status, message);
            return res.status(status).json({ system_response: system_response_, data: {} });
        }).then(async function (result) {
            status = 200;
            message = "success";
            system_response_ = new return_message(status, message);
            return res.status(status).json({ system_response: system_response_, data: result });
        });
    }
};

function getUser(uid) {
    return new Promise(function (resolve, reject) {
        var statement = "select * from users u left join coupon cd on cd.id = u.coupon_id where uid = '" + uid + "' ";
        sql.query(statement, function (err, result) {
            if (err) {
                reject(err.message);
            } else {
                resolve(...result);
            }
        });
    });
}

function getCoupon(uid) {
    return new Promise(function (resolve, reject) {
        var statement = "select * from coupon_code where uid = '" + uid + "'  ";
        sql.query(statement, function (err, result) {
            if (err) {
                reject(err.message);
            } else {
                resolve(result);
            }
        });
    });
}


function updateOpenLanding(couponId) {
    return new Promise(function (resolve, reject) {
        var statement = `update coupon_code set opened_at = now() where id = '${couponId}'`;
        sql.query(statement, function (err, result) {
            if (err) {
                reject(err.message);
            } else {
                resolve(result);
            }
        });
    });
}

function updateRedeem(uid) {
    return new Promise(function (resolve, reject) {
        var statement = `update coupon_code set redeemed_at = now() where uid = '${uid}' and redeemed_at is null`;
        sql.query(statement, function (err, result) {
            if (err) {
                reject(err.message);
            } else {
                resolve(result);
            }
        });
    });
}
