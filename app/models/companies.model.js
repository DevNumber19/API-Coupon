const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const companies =  sequelize.define('companies', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    logo_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'companies',
    timestamps: true,
    paranoid: true
  });

  companies.associate = function (models) {
    // campaign.hasOne(models.pvl_deal, { foreignKey: "id", sourceKey: "deal_id" });
    // campaign.hasMany(models.redeemHistories, { foreignKey: "deal_id", sourceKey: "deal_id" });
  };

  return companies;
};
