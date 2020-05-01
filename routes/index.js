const express = require("express");
const createStandardRouter = require("./create-crud-router");
const { companyController } = require("../controllers");

const router = express.Router();

router.use("/companies", createStandardRouter(companyController));

module.exports = router;
