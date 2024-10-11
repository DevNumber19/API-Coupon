const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('smsTask', {
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    campaign_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tel: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    provider_response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    uid: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    task_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sms_tasks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};