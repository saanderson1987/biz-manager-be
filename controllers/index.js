const Controller = require("./controller");
const { Company, Job, JobOrder } = require("../models");

module.exports = {
  companyController: new Controller(Company),
  jobController: new Controller(Job),
  jobOrderController: new Controller(JobOrder),
};
