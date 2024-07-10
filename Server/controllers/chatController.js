const model = require("../models/chatModel");

async function createChatControlleryByUserID(userID) {
  try {
    const chat = await model.createChatControlleryByUserID(userID);
    return chat.insertId;
  } catch (err) {
    throw err;
  }
}

async function createChatControllerByFileID(filedID) {
  try {
    const chat = await model.createChatControllerByFileID(filedID);
    return chat.insertId;
  } catch (err) {
    throw err;
  }
}

async function getChatControlleryByUserID(userID) {
  try {
    const chat = await model.getChatControlleryByUserID(userID);
    return chat[0];
  } catch (err) {
    throw err;
  }
}

async function getChatName(chatID) {
  try {
    const chat = await model.getChatName(chatID);
    return chat;
  } catch (err) {
    throw err;
  }
}

async function getChatControllerByFileID(filedID) {
  try {
    const chat = await model.getChatControllerByFileID(filedID);
    return chat[0];
  } catch (err) {
    throw err;
  }
}

async function getChatByNameController(name) {
  try {
    const chat = await model.getChatByName(name);
    if (!chat) {
      const chatID = await model.createChatController(name);
      return chatID;
    } else return chat.id;
  } catch (err) {
    throw err;
  }
}

async function getManagers(id) {
  try {
    const managers = await model.getManagers();
    const employees = await model.getEmployeesOfClient(id);
    return [...employees[0], ...managers[0]];
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createChatControllerByFileID,
  getChatControlleryByUserID,
  getChatControllerByFileID,
  createChatControlleryByUserID,
  getChatByNameController,
  getManagers,
  getChatName,
};
