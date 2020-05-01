"use strict";
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "Company",
    {
      name: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {}
  );
  Company.associate = function (models) {
    Company.hasMany(models.Job, { foreignKey: "companyId", as: "jobs" });
  };
  return Company;
};
