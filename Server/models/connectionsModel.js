const pool = require("../DB.js");

async function getConnections() {
  try {
    const sql =
      "SELECT clients.id AS client_id, employees.id AS employee_id, client_users.id AS client_user_id,employees.userID AS employee_user_id FROM employees JOIN users ON employees.userID = users.id JOIN employee_client ON employee_client.employeeID = employees.id JOIN clients ON employee_client.clientID = clients.id JOIN users AS client_users ON clients.userID = client_users.id";
    const result = await pool.query(sql);
    return result;
  } catch (err) {
    throw err;
  }
}

async function createConnection(employeeID, clientID) {
  try {
    const sql =
      "INSERT INTO employee_client (employeeID, clientID) VALUES (?, ?)";
    const result = await pool.query(sql, [employeeID, clientID]);
    return result;
  } catch (err) {
    throw err;
  }
}

async function deleteConnection(employeeID, clientID) {
  try {
    const sql =
      "DELETE FROM employee_client WHERE employeeID = ? AND clientID = ?";
    const result = await pool.query(sql, [employeeID, clientID]);
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
  getConnections,
  createConnection,
  deleteConnection,
  getClientIDOrEmployeeIDByUserID
};
