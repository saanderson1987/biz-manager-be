const express = require("express");

module.exports = (controller) => {
  const router = express.Router();

  router.get("/", controller.index);
  router.post("/", controller.create);
  router.get("/:id", controller.getById);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
};
