const model = require("../models/clientsModel");
require("dotenv").config();



async function getClientByCkientId(id) {
  try {
    const user = await model.getClientByCkientId(id);
    // console.log(clientsEmployee[0]);
    return user[0];
  } catch (err) {
    throw err;
  }
}

async function getClientIDOrEmployeeIDByUserID(id) {
    try {
      const type = await model.getClientIDOrEmployeeIDByUserID(id);
      // console.log(clientsEmployee[0]);
      return type[0];
    } catch (err) {
      throw err;
    }
  }

async function getClientsEmployee(id) {
  try {
    const idEmployee = await getClientIDOrEmployeeIDByUserID(id);

    console.log(idEmployee);
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
    // console.log(clientsEmployee[0]);
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
