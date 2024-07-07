const model = require("../models/chatModel");

async function createChatControlleryByUserID(userID) {
  try {
    // console.log("Creating chat controller by user ID");
    const chat = await model.createChatControlleryByUserID(userID);
    return chat.insertId;
  } catch (err) {
    throw err;
  }
}

async function createChatControllerByFileID(filedID) {
  try {
    // console.log("Creating chat controller by file ID");
    const chat = await model.createChatControllerByFileID(filedID);
    return chat.insertId;
  } catch (err) {
    throw err;
  }
}

async function getChatControlleryByUserID(userID) {
  // console.log("Getting chat by user ID");
  try {
    const chat = await model.getChatControlleryByUserID(userID);
    return chat[0];
  } catch (err) {
    throw err;
  }
}

async function getChatControllerByFileID(filedID) {
  try {
    // console.log("Getting chat by file ID");

    const chat = await model.getChatControllerByFileID(filedID);
    return chat[0];
  } catch (err) {
    throw err;
  }
}
// async function getChatByIdController(req, res) {
//   const { id } = req.params;
//   const chat = await getChatById(id);
//   return chat;
// }

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
    // console.log(clientsEmployee[0]);
    return [...employees[0], ...managers[0]];
  } catch (err) {
    throw err;
  }
}

module.exports = {
  // createChatController,
  createChatControllerByFileID,
  getChatControlleryByUserID,
  getChatControllerByFileID,
  createChatControlleryByUserID,
  // getChatByIdController,
  getChatByNameController,
  getManagers,
};
