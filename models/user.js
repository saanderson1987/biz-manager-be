"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: DataTypes.STRING,
      password: DataTypes.TEXT,
      personId: DataTypes.INTEGER,
    },
    {}
  );
  User.associate = function (models) {
    User.belongsTo(models.Person, { foreignKey: "personId", as: "person" });
  };

  User.create = function (record) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(record.password, salt);
    record.password = hash;
    return Model.create.call(this, record);
  };

  return User;
};
