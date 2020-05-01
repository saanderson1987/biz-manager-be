"use strict";
module.exports = (sequelize, DataTypes) => {
  const VendorOrder = sequelize.define(
    "VendorOrder",
    {
      jobOrderId: DataTypes.INTEGER,
      vendorId: DataTypes.INTEGER,
      numberOfPieces: DataTypes.STRING,
      dateOrdered: DataTypes.DATE,
      poNum: DataTypes.STRING,
      completed: DataTypes.BOOLEAN,
      trackingNum: DataTypes.STRING,
    },
    {}
  );
  VendorOrder.associate = function (models) {
    VendorOrder.belongsTo(models.Company, {
      foreignKey: "vendorId",
      as: "vendor",
    });
    VendorOrder.belongsTo(models.JobOrder, {
      foreignKey: "jobOrderId",
      as: "jobOrder",
    });
    VendorOrder.hasMany(models.VendorOrderReplacement, {
      foreignKey: "vendorOrderId",
      as: "vendorOrderReplacements",
    });
  };
  return VendorOrder;
};
