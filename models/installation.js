"use strict";
module.exports = (sequelize, DataTypes) => {
  const Installation = sequelize.define(
    "Installation",
    {
      installationDate: DataTypes.DATE,
      completed: DataTypes.BOOLEAN,
      jobOrderId: DataTypes.INTEGER,
    },
    {}
  );
  Installation.associate = function (models) {
    Installation.belongsTo(models.JobOrder, {
      foreignKey: "jobOrderId",
      as: "jobOrder",
    });
    Installation.hasMany(models.Installer, {
      foreignKey: "installationId",
      as: "installers",
    });
  };
  return Installation;
};
