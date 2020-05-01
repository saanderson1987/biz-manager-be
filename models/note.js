"use strict";
module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define(
    "Note",
    {
      parentId: DataTypes.INTEGER,
      parentTable: DataTypes.STRING,
      authorId: DataTypes.INTEGER,
    },
    {}
  );
  Note.associate = function (models) {
    Note.belongsTo(models.Person, {
      foreignKey: "authorId",
      as: "author",
    });
  };
  return Note;
};
