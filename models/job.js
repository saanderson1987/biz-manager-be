"use strict";
module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define(
    "Job",
    {
      name: DataTypes.STRING,
      poNum: DataTypes.STRING,
      companyId: DataTypes.INTEGER,
      status: DataTypes.ENUM("inProgress", "onHold", "completed"),
      budgetSentDate: DataTypes.DATE,
      imageProposalSentDate: DataTypes.DATE,
      artPlanSentDate: DataTypes.DATE,
      receivableStatus: DataTypes.ENUM("PO sent", "50% paid", "100% paid"),
    },
    {}
  );
  Job.associate = function (models) {
    Job.belongsTo(models.Company, { foreignKey: "companyId", as: "company" });
    Job.hasMany(models.JobOrder, { foreignKey: "jobId", as: "jobOrders" });
  };
  return Job;
};
