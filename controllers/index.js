const Controller = require("./controller");
const { Company } = require("../models");

module.exports = {
  companyController: new Controller(Company),
};
