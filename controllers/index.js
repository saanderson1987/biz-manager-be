const Controller = require("./controller");
const { Company, Job } = require("../models");

module.exports = {
  companyController: new Controller(Company),
  jobController: new Controller(Job),
};
