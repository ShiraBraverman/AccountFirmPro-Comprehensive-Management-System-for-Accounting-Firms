const pool = require("../DB.js");

async function createChat(name) {
  try {
    const result = await pool.query("INSERT INTO chats (name) VALUES (?)", [name]);
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function createChatControllerByFileID(fileID) {
  try {
    const sql = "INSERT INTO chats (fileID) VALUES (?)";
    const result = await pool.query(sql, [fileID]);
    console.log(`INSERT INTO chats (fileID) VALUES (${fileID})`);
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function createChatControlleryByUserID(userID) {
  try {
    const sql = "INSERT INTO chats (userID) VALUES (?)";
    const result = await pool.query(sql, [userID]);
    console.log(`INSERT INTO chats (userID) VALUES (${userID})`);
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getChatControllerByFileID(fileID) {
  try {
    const result = await pool.query("SELECT * FROM chats WHERE fileID = ?", [fileID,]);
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getChatControlleryByUserID(userID) {
  try {
    const result = await pool.query("SELECT * FROM chats WHERE userID = ?", [userID,]);
    return result[0];
  } catch (err) {
    throw err;
  }
}

async function getChatById(id) {
  try {
    const [rows] = await pool.query("SELECT * FROM chats WHERE id = ?", [id]);
    return rows[0];
  } catch (err) {
    throw err;
  }
}

async function getChatName(chatID) {
  try {
    const [rows] = await pool.query(
      `SELECT 'user' AS type, u.name AS name, c.userID AS userID
FROM users u left join chats c on c.userID = u.id
WHERE c.id = ? 
UNION
SELECT 'file' AS type, u.name AS name, f.clientID AS userID
FROM files f  left join chats c on c.fileID = f.id left join users u on f.clientID = u.id
WHERE c.id = ?`,
      [chatID, chatID]
    );
    return rows[0];
  } catch (err) {
    throw err;
  }
}

async function getChatByName(name) {
  try {
    const [rows] = await pool.query("SELECT * FROM chats WHERE name = ?", [
      name,
    ]);
    return rows[0];
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

module.exports = {
  createChat,
  getChatById,
  getChatByName,
  createChatControllerByFileID,
  createChatControlleryByUserID,
  getChatControllerByFileID,
  getChatControlleryByUserID,
  getManagers,
  getChatName,
};
