const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    uid: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    coupon_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mobile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    firstname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cart_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    delivery_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cart_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    product_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    product_qty: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_by: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true
  });
};
