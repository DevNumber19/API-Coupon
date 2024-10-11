const Sequelize = require('sequelize');
const { appUrl } = require("../config/vars");
module.exports = function(sequelize, DataTypes) {
  const coupon = sequelize.define('coupon', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    coupon_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    coupon_short_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    coupon_detail: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    coupon_image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    campaign_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    coupon_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    coupon_sms_format: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    campaign_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    deleted_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    sequelize,
    tableName: 'coupon',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  coupon.associate = function (models) {    
    coupon.hasMany(models.coupon_code, { foreignKey: 'coupon_id', sourceKey: 'id', as: 'couponCodes' });
    // coupon.hasMany(models.couponCode, { foreignKey: "coupon_id", sourceKey: "id" });
    // campaign.hasOne(models.pvl_deal, { foreignKey: "id", sourceKey: "deal_id" });
    // campaign.hasMany(models.redeemHistories, { foreignKey: "deal_id", sourceKey: "deal_id" });
  };
  return coupon
};
