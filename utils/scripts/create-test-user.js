const { User } = require("../../models");

const test = {
  username: "test2",
  password: "test2",
};

User.create(test).then((user) => console.log(user));
