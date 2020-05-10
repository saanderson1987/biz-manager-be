"use strict";
const isEmpty = require("lodash.isempty");
const { Model } = require("sequelize");

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

  Installer.createAndGet = function (record, returnAttributes) {
    if (record.person_name) {
      return Installer.associations.person.target
        .create({ name: record.person_name })
        .then((newPerson) => {
          const modifiedRecord = { ...record, personId: newPerson.id };
          delete modifiedRecord.person_name;
          return Model.createAndGet.call(
            this,
            modifiedRecord,
            returnAttributes
          );
        });
    }
    return Model.createAndGet.call(this, record, returnAttributes);
  };

  Installer.updateAndGet = function (id, record, returnAttributes) {
    if (record.person_name) {
      return Model.findOne
        .call(this, {
          attributes: ["personId"],
          where: { id },
        })
        .then((installerRecord) => {
          console.log(Installer.associations.person.target);
          return Installer.associations.person.target
            .update(
              { name: record.person_name },
              { where: { id: installerRecord.personId } }
            )
            .then(() => {
              const modifiedRecord = { ...record };
              delete modifiedRecord.person_name;
              if (!isEmpty(modifiedRecord)) {
                return Model.updateAndGet.call(
                  this,
                  id,
                  modifiedRecord,
                  returnAttributes
                );
              } else {
                return Model.getOne.call(this, id, {
                  attributes: returnAttributes,
                });
              }
            });
        });
    }
  };

  return Installer;
};
