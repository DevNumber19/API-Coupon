const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const couponCode = sequelize.define("coupon_code", {
    coupon_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    coupon_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    coupon_code_text: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    uid: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_disable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    redeemed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    opened_at: {
      type: DataTypes.DATE,
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
    data1: {
      type: DataTypes.STRING
    },
    data2: {
      type: DataTypes.STRING
    },
    data3: {
      type: DataTypes.STRING
    },
    data4: {
      type: DataTypes.STRING
    },
    data5: {
      type: DataTypes.STRING
    },
    data6: {
      type: DataTypes.STRING
    },
    reference_code : {
      type: DataTypes.STRING
    },
    created_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    tableName: 'coupon_code',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  couponCode.associate = function (models) {
    couponCode.hasOne(models.coupon, { foreignKey: "id", sourceKey: "coupon_id" });
    // campaign.hasMany(models.redeemHistories, { foreignKey: "deal_id", sourceKey: "deal_id" });
  };

  return couponCode
};
