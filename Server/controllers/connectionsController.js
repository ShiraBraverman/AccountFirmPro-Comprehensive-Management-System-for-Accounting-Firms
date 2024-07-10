const model = require("../models/connectionsModel");
require("dotenv").config();

async function getConnections() {
  try {
    const connections = await model.getConnections();
    return connections[0];
  } catch (err) {
    throw err;
  }
}

async function deleteConnection(employeeID, clientID) {
  try {
    const connections = await model.deleteConnection(employeeID, clientID);
    return connections[0];
  } catch (err) {
    throw err;
  }
}

async function createConnection(employeeID, clientID) {
  try {
    const employeeUserID = await getClientIDOrEmployeeIDByUserID(employeeID);
    const clientUserID = await getClientIDOrEmployeeIDByUserID(clientID);
    const connections = await model.createConnection(employeeUserID.employee_id, clientUserID.client_id);
    return connections[0];
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

module.exports = {
  getClientIDOrEmployeeIDByUserID,
  createConnection,
  getConnections,
  deleteConnection,
};
