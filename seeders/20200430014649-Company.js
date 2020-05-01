"use strict";

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      "Companies",
      [
        {
          name: "Test Co 1",
          status: "client",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Test Co 2",
          status: "client",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Test Co 3",
          status: "prospect",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete("Users", null, {}),
};
