"use strict";
module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define(
    "Job",
    {
      name: DataTypes.STRING,
      poNum: DataTypes.STRING,
      companyId: DataTypes.INTEGER,
    },
    {}
  );
  Job.associate = function (models) {
    Job.belongsTo(models.Company, { foreignKey: "companyId", as: "company" });
  };
  return Job;
};
