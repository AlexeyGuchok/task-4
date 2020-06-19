const Sequelize = require("sequelize");
const db = require("../database/database");

const User = db.define("user", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  surname: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  registration: {
    type: Sequelize.TIME,
  },
  last: {
    type: Sequelize.TIME,
  },
});

module.exports = User;
