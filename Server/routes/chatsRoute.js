const express = require("express");
const router = express.Router();
const {
  createChatControllerByFileID,
  createChatControlleryByUserID,
  getChatControlleryByUserID,
  getChatControllerByFileID,
  getChatName,
} = require("../controllers/chatController");
require("dotenv").config();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/chat", async (req, res) => {
  try {
    const { fileID, userID } = req.body;
    let chat;
    if (fileID) chat = await createChatControllerByFileID(fileID);
    else if (userID) chat = await createChatControlleryByUserID(userID);
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/chat", async (req, res) => {
  try {
    const { fileID, userID } = req.query;
    let chat;
    if (fileID != "null") chat = await getChatControllerByFileID(fileID);
    else if (userID) chat = await getChatControlleryByUserID(userID);
    if (chat) res.status(200).json(chat);
    else res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/name", async (req, res) => {
  try {
    const { chatID } = req.query;
    const chatName = await getChatName(chatID);
    res.status(200).send(chatName);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/apiKey", async (req, res) => {
  try {
    const apiKey = process.env.STREAM_API_KEY;
    res.status(200).send([apiKey]);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/getChatIDFromSession", (req, res) => {
  try {
    if (req.session.chatId) {
      res.status(200).send({ chatId: req.session.chatId });
    } else {
      res.status(404).send({ message: "ChatID not found in session" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });

  }
});

router.get("/clearChatIDFromSession", (req, res, next) => {
  try {
    if (req.session.chatId) {
      delete req.session.chatId;
      res.sendStatus(200);
    } else res.sendStatus(404);
  } catch (error) {
    res.status(500).send({ error: error.message });

  }
});

router.post("/storeChatIDToSession", async (req, res, next) => {
  try {
    const chatId = req.body.chatId || req.query.chatId;
    if (chatId) {
      req.session.chatId = chatId;
      res.status(200).json({ message: "chatId stored successfully" });
    } else {
      res.status(400).json({ message: "No chatId provided" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });

  }
});

module.exports = router;
