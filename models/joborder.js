"use strict";
module.exports = (sequelize, DataTypes) => {
  const JobOrder = sequelize.define(
    "JobOrder",
    {
      dateOrdered: DataTypes.DATE,
      jobId: DataTypes.INTEGER,
    },
    {}
  );
  JobOrder.associate = function (models) {
    JobOrder.belongsTo(models.Job, { foreignKey: "jobId", as: "job" });
  };
  return JobOrder;
};
