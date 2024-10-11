require("dotenv").config();
module.exports = {
  env: process.env.NODE_ENV || "development",
  appUrl: process.env.APP_URL,
  port: process.env.PORT,
  mysql: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    waitForConnection: true,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 5,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000,
    },
    dialectOptions: {
      useUTC: false, //for reading from database
      typeCast: true,
      timezone: "+07:00",
    },
    timezone: "+07:00",
  },
  smartCommSmsUrl: process.env.SMARTCOMM_SMS_URL,
  smartCommSmsUser: process.env.SMARTCOMM_SMS_USER,
  smartCommSmsPassword: process.env.SMARTCOMM_SMS_PASSWORD,
  frontendUrl: process.env.FRONTEND_URL,
  campaignId: process.env.CAMPAIGN_ID,
  smartCommSmsUrlFey: process.env.SMARTCOMM_SMS_URL_FEY,
  smartCommSmsUserFey: process.env.SMARTCOMM_SMS_USER_FEY,
  smartCommSmsPasswordFey: process.env.SMARTCOMM_SMS_PASSWORD_FEY,
  smartCommSmsUrlFeySender: process.env.SMARTCOMM_SMS_URL_FEY_SENDER,
  smartCommSmsUserFeySender: process.env.SMARTCOMM_SMS_USER_FEY_SENDER,
  smartCommSmsPasswordFeySender: process.env.SMARTCOMM_SMS_PASSWORD_FEY_SENDER,
};
