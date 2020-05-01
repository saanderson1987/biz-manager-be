"use strict";
module.exports = (sequelize, DataTypes) => {
  const Installer = sequelize.define(
    "Installer",
    {
      personId: DataTypes.INTEGER,
      installationId: DataTypes.INTEGER,
    },
    {}
  );
  Installer.associate = function (models) {
    Installer.belongsTo(models.Person, {
      foreignKey: "personId",
      as: "person",
    });
    Installer.belongsTo(models.Installation, {
      foreignKey: "installationId",
      as: "installation",
    });
  };
  return Installer;
};
