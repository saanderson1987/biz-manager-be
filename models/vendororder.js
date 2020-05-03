"use strict";
const { Model } = require("sequelize");

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

  VendorOrder.createAttributesAndIncludeOptions = function (attributesString) {
    if (
      attributesString &&
      attributesString.includes("doesVendorOrderHaveReplacements")
    ) {
      return Model.createAttributesAndIncludeOptions.call(
        this,
        attributesString.replace(
          "doesVendorOrderHaveReplacements",
          "vendorOrderReplacements_id"
        )
      );
    }
    return Model.createAttributesAndIncludeOptions.call(this, attributesString);
  };

  VendorOrder.formatAttr_vendorOrderReplacements = function (data) {
    return data && data.length > 0;
  };

  return VendorOrder;
};
