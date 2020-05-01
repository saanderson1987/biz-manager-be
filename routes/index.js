const express = require("express");
const createStandardRouter = require("./create-crud-router");
const {
  companyController,
  jobController,
  jobOrderController,
} = require("../controllers");

const router = express.Router();

router.use("/companies", createStandardRouter(companyController));
router.use("/jobs", createStandardRouter(jobController));
router.use("/jobOrders", createStandardRouter(jobOrderController));

module.exports = router;
