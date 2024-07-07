const pool = require("../DB.js");

async function getEmployees() {
    try {
      const sql = `SELECT * from employees LEFT JOIN users ON employees.userID = users.id where role!="Admin" AND users.name IS NOT NULL`;
      const result = await pool.query(sql);
      return result;
    } catch (err) {
      throw err;
    }
}

module.exports = {
    getEmployees
  };
  