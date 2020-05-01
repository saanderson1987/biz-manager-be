"use strict";
module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define(
    "Person",
    {
      companyId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      phoneNum: DataTypes.STRING,
      email: DataTypes.STRING,
      position: DataTypes.STRING,
    },
    {}
  );
  Person.associate = function (models) {
    Person.hasMany(models.Note, { foreignKey: "authorId", as: "notes" });
  };
  return Person;
};
