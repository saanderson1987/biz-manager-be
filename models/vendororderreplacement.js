"use strict";
module.exports = (sequelize, DataTypes) => {
  const VendorOrderReplacement = sequelize.define(
    "VendorOrderReplacement",
    {
      vendorOrderId: DataTypes.INTEGER,
      itemNumber: DataTypes.STRING,
      completed: DataTypes.BOOLEAN,
    },
    {}
  );
  VendorOrderReplacement.associate = function (models) {
    VendorOrderReplacement.belongsTo(models.VendorOrder, {
      foreignKey: "vendorOrderId",
      as: "vendorOrder",
    });
  };
  return VendorOrderReplacement;
};
