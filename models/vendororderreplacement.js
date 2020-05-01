"use strict";
module.exports = (sequelize, DataTypes) => {
  const VendorOrderReplacement = sequelize.define(
    "VendorOrderReplacement",
    {
      vendorOrderId: DataTypes.INTEGER,
      itemNumber: DataTypes.STRING,
      complete: DataTypes.BOOLEAN,
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
