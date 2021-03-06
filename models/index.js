"use strict";

const fs = require("fs");
const path = require("path");
const { loadPGEnumFix } = require("../utils");

loadPGEnumFix(); // Fixes a bug with enum data types while syncing the database.
const { Sequelize, Model } = require("sequelize");
const extendBaseModel = require("./extend-base-model");

extendBaseModel(Model);

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file !== "extend-base-model.js" &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
