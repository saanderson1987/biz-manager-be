// CLI to sync db with models

const models = require("../models");

const validArgs = new Set(["force", "alter"]);
const syncOptions = process.argv.slice(2).reduce((acc, arg) => {
  if (validArgs.has(arg)) {
    acc[arg] = true;
  }
  return acc;
}, {});

models.sequelize.sync(syncOptions);
