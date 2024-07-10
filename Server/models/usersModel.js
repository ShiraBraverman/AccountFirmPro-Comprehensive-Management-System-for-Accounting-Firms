const pool = require("../DB.js");

async function getEmployeesOfClient(id) {
  try {
    const sql = `SELECT e.userID AS employeeUserID
FROM clients c
JOIN employee_client ec ON c.id = ec.clientID
JOIN employees e ON ec.employeeID = e.id
WHERE c.userID = ?`;
    const result = await pool.query(sql, [id]);
    return result;
  } catch (err) {
    throw err;
  }
}

async function getManagers() {
  try {
    const sql = `SELECT userID from employees where role = "Admin"`;
    const result = await pool.query(sql);
    return result;
  } catch (err) {
    throw err;
  }
}

async function getClientByCkientId(id) {
  try {
    const sql = `SELECT name from clients left join users on clients.userID = users.id where clients.id = ?`;
    const result = await pool.query(sql, [id]);
    return result;
  } catch (err) {
    throw err;
  }
}

async function getUser(id) {
  try {
    const sql =
      "SELECT phone, email, name, userName, users.id, street, zipcode, city, users.addressID, role, streamToken FROM users LEFT JOIN addresses ON users.addressID = addresses.addressID LEFT JOIN employees ON users.id = employees.userID WHERE users.id = ?";
    const result = await pool.query(sql, [id]);
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getUserByPasswordAndUserName(userName) {
  try {
    const sql =
      "SELECT password, phone, email, name, userName, users.id, street, zipcode, city, role, streamToken FROM users NATURAL JOIN passwords LEFT JOIN addresses ON users.addressID = addresses.addressID LEFT JOIN employees ON users.id = employees.userID WHERE userName=?";
    const result = await pool.query(sql, userName);
    const user = result[0];

    return user;
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

async function updateStreamToken(token, userId) {
  try {
    const sql = "UPDATE users SET streamToken = ? WHERE id = ? ";
    const result = await pool.query(sql, [token, userId]);
    const id = result[0];
    return id;
  } catch (err) {
    throw err;
  }
}

async function createUser(userName, hashedPassword, employeType, role) {
  try {
    const sql = "INSERT INTO users (`userName`,`name`) VALUES(?,?)";
    const newUser = await pool.query(sql, [userName, userName]);
    const sqlPassword = "INSERT INTO passwords (id, password) VALUES(?,?)";
    const newPassword = await pool.query(sqlPassword, [
      newUser[0].insertId,
      hashedPassword,
    ]);
    switch (role) {
      case "Admin":
        {
          const sql =
            "INSERT INTO cbs_db.employees (`userID`, `role`) VALUES(?, ?)";
          const newEmployee = await pool.query(sql, [
            newUser[0].insertId,
            "Admin",
          ]);
        }
        break;
      case "Employee":
        {
          const sql =
            "INSERT INTO cbs_db.employees (`userID`, `role`) VALUES(?, ?)";
          const newEmployee = await pool.query(sql, [
            newUser[0].insertId,
            employeType,
          ]);
        }
        break;
      case "Client":
        {
          const sql = "INSERT INTO cbs_db.clients (`userID`) VALUES(?)";
          const newClient = await pool.query(sql, [newUser[0].insertId]);
        }
        break;
      default:
        break;
    }
    return newUser[0];
  } catch (err) {
    throw err;
  }
}
const updateUser = async (id, userName, name, email, phone, street, city, zipcode) => {
  const user = await getUser(id);
  let address = user[0].addressID;
  let resultAddress;
  try {
    if (address == null) {
      const sqlAddress =
        "INSERT INTO addresses (`street`, `city`, `zipcode`) VALUES (?, ?, ?)";
      const addressInsert = await pool.query(sqlAddress, [
        street,
        city,
        zipcode,
      ]);
      resultAddress = addressInsert.insertId;
    } else {
      const sqlAddress = `UPDATE addresses SET street = ?, city = ?, zipcode = ? WHERE addressID = ?`;
      await pool.query(sqlAddress, [street, city, zipcode, user[0].addressID]);
      resultAddress = user[0].addressID;
    }
    const sql = `UPDATE users SET userName = ?, name = ?, email = ?, phone = ?, addressID = ? WHERE id = ?`;
    const result = await pool.query(sql, [
      userName,
      name,
      email,
      phone,
      resultAddress,
      id,
    ]);
    const user1 = await getUser(id);
    return user1;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getManagers,
  getUserByPasswordAndUserName,
  createUser,
  getUser,
  updateUser,
  getClientIDOrEmployeeIDByUserID,
  getClientByCkientId,
  updateStreamToken,
  getEmployeesOfClient,
};
