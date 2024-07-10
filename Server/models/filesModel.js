const pool = require("../DB.js");

async function saveFileToDB(fileId, fileName, type, uploaderID, clientID) {
  try {
    const sql = `INSERT INTO files (driveFileId, name, type, uploaderID, clientID, status) VALUES (?, ?, ?, ?, ?, ?)`;
    const newFile = await pool.query(sql, [fileId, fileName, type, uploaderID, clientID, "Pending",]);
    return newFile[0];
  } catch (err) {
    throw err;
  }
}

async function getFilesByClientID(clientID, type) {
  try {
    const sql = `SELECT * FROM files WHERE clientID = ? AND type = ?`;
    const files = await pool.query(sql, [clientID, type]);
    return files[0];
  } catch (err) {
    throw err;
  }
}

async function numFilesPerDayClient(userID) {
  try {
    const sql = `
    SELECT 
      DATE(createdAt) AS date,
      COUNT(*) AS count
    FROM 
      files
    WHERE 
      clientID = ? 
      AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY 
      DATE(createdAt)
    HAVING 
      count > 0
    ORDER BY 
      date`;

    const result = await pool.query(sql, [userID]);
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function numFilesPerDayAdmin() {
  try {
    const sql = `
    SELECT 
      DATE(createdAt) AS date,
      COUNT(*) AS count
    FROM 
      files
    WHERE 
      createdAt >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY 
      DATE(createdAt)
    HAVING 
      count > 0
    ORDER BY 
      date`;

    const result = await pool.query(sql);
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function numFilesPerDayEmployee(userID) {
  try {
    const sql = `
    SELECT
      DATE(f.createdAt) AS date,
      COUNT(*) AS count
    FROM
      files f
      JOIN clients c ON f.clientID = c.userID
      JOIN employee_client ec ON ec.clientID = c.id
      JOIN employees e ON ec.employeeID = e.id
    WHERE
      f.createdAt >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      AND e.userID = ?
    GROUP BY
      DATE(f.createdAt)
    HAVING
      count > 0
    ORDER BY 
      date`;

    const result = await pool.query(sql, [userID]);
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getStatusClient(userID) {
  try {
    const sql = `SELECT status, COUNT(*) AS count
FROM files
WHERE clientID = ?
GROUP BY status
ORDER BY status ASC;`;
    const result = await pool.query(sql, [userID]);
    return result;
  } catch (err) {
    throw err;
  }
}

async function getStatusAdmin() {
  try {
    const sql = `SELECT status, COUNT(*) AS count
FROM files
GROUP BY status
ORDER BY status ASC;`;
    const result = await pool.query(sql);
    return result;
  } catch (err) {
    throw err;
  }
}

async function getStatusEmployee(userID) {
  try {
    const sql = `SELECT f.status, COUNT(*) AS count
FROM employees e
JOIN employee_client ec ON e.id = ec.employeeID
JOIN clients c ON ec.clientID = c.id
JOIN files f ON c.userID = f.clientID
WHERE e.userID = ?
GROUP BY f.status
ORDER BY status ASC`;
    const result = await pool.query(sql, [userID]);
    return result;
  } catch (err) {
    throw err;
  }
}

async function getPendingFilesByEmployee(userID) {
  try {
    const sql = `
     SELECT f.id, f.name, f.status, f.type, u.name AS clientName, c.userID AS clientID
      FROM files f
      JOIN clients c ON f.clientID = c.userID
      JOIN users u ON c.userID = u.id
      JOIN employee_client ec ON c.id = ec.clientID
      JOIN employees e ON ec.employeeID = e.id
      WHERE e.userID = ? AND f.status = 'Pending'
      ORDER BY f.createdAt DESC
    `;
    const result = await pool.query(sql, [userID]);
    return result;
  } catch (err) {
    throw err;
  }
}

async function numberFilesTypesClient(userID) {
  try {
    const sql = `
SELECT type, COUNT(*) AS count
FROM files
WHERE clientID = ?
GROUP BY type`;
    const result = await pool.query(sql, [userID]);
    return result;
  } catch (err) {
    throw err;
  }
}

async function numberFilesTypesAdmin() {
  try {
    const sql = `
SELECT type, COUNT(*) AS count
FROM files
GROUP BY type`;
    const result = await pool.query(sql);
    return result;
  } catch (err) {
    throw err;
  }
}

async function numberFilesTypesAndStatusAdmin() {
  try {
    const sql = `
      SELECT type, status, COUNT(*) AS count
      FROM files
      GROUP BY type, status
      ORDER BY type, status`;
    const result = await pool.query(sql);
    return result;
  } catch (err) {
    throw err;
  }
}

async function numberFilesTypesAndStatusClient(userID) {
  try {
    const sql = `
      SELECT type, status, COUNT(*) AS count
      FROM files
      WHERE clientID = ?
      GROUP BY type, status
      ORDER BY type, status`;
    const result = await pool.query(sql, [userID]);
    return result;
  } catch (err) {
    throw err;
  }
}

async function numberFilesTypesAndStatusEmployee(userID) {
  try {
    const sql = `
      SELECT f.type, f.status, COUNT(*) AS count
      FROM files f
      JOIN clients c ON f.clientID = c.id
      JOIN employee_client ec ON c.id = ec.clientID
      JOIN employees e ON ec.employeeID = e.id
      WHERE e.userID = ?
      GROUP BY f.type, f.status
      ORDER BY f.type, f.status`;
    const result = await pool.query(sql, [userID]);
    return result;
  } catch (err) {
    throw err;
  }
}

async function countTypeFileByClientID(type, userID) {
  const sql = `SELECT COUNT(*) AS count FROM files LEFT JOIN clients ON files.clientID = clients.userID WHERE type = ? AND clients.userID = ?`;
  const files = await pool.query(sql, [type, userID]);
  return files[0];
}

async function countTypeFileByEmployeeID(type, userID) {
  const sql = `SELECT
    e.id AS employeeID,
    COUNT(f.id) AS count
    FROM
    employees emp
JOIN
    users e ON emp.userID = e.id
JOIN
    employee_client ec ON emp.id = ec.employeeID
JOIN
    clients c ON ec.clientID = c.id
LEFT JOIN
    files f ON c.userID = f.clientID
WHERE
    e.id = ? AND type = ?
GROUP BY
    e.id`;
  const files = await pool.query(sql, [userID, type]);
  return files[0];
}

async function updateRemarkFile(id, remark) {
  try {
    const sql = `UPDATE files SET remark = ? WHERE id = ?`;
    const files = await pool.query(sql, [remark, id]);
    return files[0];
  } catch (err) {
    throw err;
  }
}

async function updateStatusFile(id, status) {
  try {
    const sql = `UPDATE files SET status = ? WHERE id = ?`;
    const files = await pool.query(sql, [status, id]);
    return files[0];
  } catch (err) {
    throw err;
  }
}

async function getFilesByEmployeeID(userID, type) {
  try {
    const sql = `SELECT files.id, files.driveFileId, files.uploaderID, files.createdAt, files.updatedAt, files.name, files.type, files.status, files.remark, files.clientID FROM employee_client LEFT JOIN clients ON employee_client.clientID = clients.id LEFT JOIN files ON files.clientID = clients.userID  WHERE employee_client.employeeID = ? AND files.type = ? `;
    const files = await pool.query(sql, [userID, type]);
    return files[0];
  } catch (err) {
    throw err;
  }
}

async function updateTypeFile(id, type) {
  try {
    const sql = `UPDATE files SET type = ? WHERE id = ?`;
    const files = await pool.query(sql, [type, id]);
    return files[0];
  } catch (err) {
    throw err;
  }
}

async function getFilesIDByClientIDType(clientID, type) {
  try {
    const sql = `SELECT id FROM files WHERE clientID = ? AND type = ?`;
    const files = await pool.query(sql, [clientID, type]);
    return files[0];
  } catch (err) {
    throw err;
  }
}

async function getFilesIDByClientID(clientID) {
  try {
    const sql = `SELECT id FROM files WHERE clientID = ?`;
    const files = await pool.query(sql, [clientID]);
    return files[0];
  } catch (err) {
    throw err;
  }
}

module.exports = {
  saveFileToDB,
  getFilesByClientID,
  getFilesByEmployeeID,
  updateRemarkFile,
  updateStatusFile,
  updateTypeFile,
  countTypeFileByClientID,
  countTypeFileByEmployeeID,
  getPendingFilesByEmployee,
  getStatusAdmin,
  getStatusEmployee,
  getStatusClient,
  numberFilesTypesClient,
  numberFilesTypesAdmin,
  numberFilesTypesAndStatusEmployee,
  numberFilesTypesAndStatusClient,
  numberFilesTypesAndStatusAdmin,
  numFilesPerDayEmployee,
  numFilesPerDayAdmin,
  numFilesPerDayClient,
  getFilesIDByClientID,
  getFilesIDByClientIDType,
};
