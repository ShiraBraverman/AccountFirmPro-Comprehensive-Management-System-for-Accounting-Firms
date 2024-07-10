const model = require("../models/clientsModel");
require("dotenv").config();

async function getClientByCkientId(id) {
  try {
    const user = await model.getClientByCkientId(id);
    return user[0];
  } catch (err) {
    throw err;
  }
}

async function getClientIDOrEmployeeIDByUserID(id) {
    try {
      const type = await model.getClientIDOrEmployeeIDByUserID(id);
      return type[0];
    } catch (err) {
      throw err;
    }
  }

async function getClientsEmployee(id) {
  try {
    const idEmployee = await getClientIDOrEmployeeIDByUserID(id);
    const clientsEmployee = await model.getClientsEmployee(
      idEmployee.employee_id
    );
    return clientsEmployee[0];
  } catch (err) {
    throw err;
  }
}


async function getClients() {
  try {
    const clients = await model.getClients();
    return clients[0];
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getClientsEmployee,
  getClients,
  getClientIDOrEmployeeIDByUserID,
  getClientByCkientId,
};