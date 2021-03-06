const Controller = require("./controller");
const {
  Company,
  Installation,
  Installer,
  Job,
  JobOrder,
  Note,
  Person,
  User,
  VendorOrder,
  VendorOrderReplacement,
} = require("../models");

module.exports = {
  companyController: new Controller(Company),
  installationController: new Controller(Installation),
  installerController: new Controller(Installer),
  jobController: new Controller(Job),
  jobOrderController: new Controller(JobOrder),
  noteController: new Controller(Note),
  personController: new Controller(Person),
  userController: new Controller(User),
  vendorOrderController: new Controller(VendorOrder),
  vendorOrderReplacementController: new Controller(VendorOrderReplacement),
};
