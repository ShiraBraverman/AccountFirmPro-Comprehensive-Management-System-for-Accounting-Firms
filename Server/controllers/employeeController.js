const model = require("../models/employeeModel");
require("dotenv").config();

async function getEmployees() {
  try {
    const employees = await model.getEmployees();
    return employees[0];
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getEmployees,
};
