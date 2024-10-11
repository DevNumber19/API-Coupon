const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const campaign = sequelize.define('campaigns', {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(255)// sms,landing_page
    },
    campaign_ref: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_send: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_send_success: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_send_unsuccess: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_opened: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_redeem: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    limit_redeem: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'campaigns',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  campaign.associate = function (models) {
    // campaign.hasOne(models.pvl_deal, { foreignKey: "id", sourceKey: "deal_id" });
    // campaign.hasMany(models.redeemHistories, { foreignKey: "deal_id", sourceKey: "deal_id" });
  };
  return campaign
};
