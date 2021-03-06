const express = require("express");
const createStandardRouter = require("./create-crud-router");
const authenticationRouter = require("./authentication-router");
const {
  companyController,
  installationController,
  installerController,
  jobController,
  jobOrderController,
  noteController,
  personController,
  userController,
  vendorOrderController,
  vendorOrderReplacementController,
} = require("../controllers");

const router = express.Router();

router.use(authenticationRouter);

router.use(function requireAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.send("Please log in");
  }
});

router.use("/companies", createStandardRouter(companyController));
router.use("/installations", createStandardRouter(installationController));
router.use("/installers", createStandardRouter(installerController));
router.use("/jobs", createStandardRouter(jobController));
router.use("/jobOrders", createStandardRouter(jobOrderController));
router.use("/notes", createStandardRouter(noteController));
router.use("/people", createStandardRouter(personController));
router.use("/users", createStandardRouter(userController));
router.use("/vendorOrders", createStandardRouter(vendorOrderController));
router.use(
  "/vendorOrderReplacements",
  createStandardRouter(vendorOrderReplacementController)
);

module.exports = router;
