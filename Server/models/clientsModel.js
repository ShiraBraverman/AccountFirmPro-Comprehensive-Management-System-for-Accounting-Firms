const pool = require("../DB.js");

async function getClientByCkientId(id) {
  try {
    const sql = `SELECT name from clients left join users on clients.userID = users.id where clients.id = ?`;
    const result = await pool.query(sql, [id]);
    return result;
  } catch (err) {
    throw err;
  }
}

async function getClients() {
  try {
    const sql =
      "SELECT users.id, users.userName, users.name, users.email, users.phone, users.addressID, clients.id AS client_id, clients.userID from clients LEFT JOIN users ON clients.userID = users.id WHERE users.name IS NOT NULL";
    const result = await pool.query(sql);
    return result;
  } catch (err) {
    throw err;
  }
}

async function getClientsEmployee(id) {
  try {
    const sql =
      "SELECT users.id, users.userName, users.name, users.email, users.phone, users.addressID, clients.id AS client_id, clients.userID FROM clients Left JOIN users ON users.id = clients.userID Left JOIN employee_client ON employee_client.clientID = clients.id LEFT JOIN employees ON employee_client.employeeID = employees.id WHERE employees.id = ?";
    const result = await pool.query(sql, [id]);
    return result;
  } catch (err) {
    throw err;
  }
}

async function getClientIDOrEmployeeIDByUserID(userID) {
  try {
    const sql =
      "SELECT clients.id AS client_id, employees.id AS employee_id FROM users LEFT JOIN clients ON users.id = clients.userID LEFT JOIN employees ON users.id = employees.userID WHERE users.id = ?";
    const result = await pool.query(sql, userID);
    const id = result[0];
    return id;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getClients,
  getClientIDOrEmployeeIDByUserID,
  getClientsEmployee,
  getClientByCkientId,
};
