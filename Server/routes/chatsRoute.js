const express = require("express");
const router = express.Router();
const {
  createChatControllerByFileID,
  createChatControlleryByUserID,
  // getChatByNameController,
  getChatControlleryByUserID,
  getChatControllerByFileID,
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

// router.get("/chatMembers", async (req, res) => {
//   try {
//     const id = req.query.id;
//     const members = await getManagers(id);
//     res.status(200).send([members]);
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// });

router.get("/apiKey", async (req, res) => {
  try {
    const apiKey = process.env.STREAM_API_KEY;
    // console.log("apiKey");
    // console.log([apiKey]);
    res.status(200).send([apiKey]);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/getChatIDFromSession", (req, res) => {
  // console.log("getchatId");
  if (req.session.chatId) {
    // console.log(req.session.chatId);
    res.status(200).send({ chatId: req.session.chatId });
  } else {
    // console.log("false");
    res.status(404).send({ message: "ChatID not found in session" });
  }
});

router.get("/clearChatIDFromSession", (req, res, next) => {
  // console.log("clearchatId");
  if (req.session.chatId) {
    // console.log(req.session.chatId);
    delete req.session.chatId;
    // console.log(req.session.chatId);
    res.sendStatus(200);
  } else res.sendStatus(404);
});

router.post("/storeChatIDToSession", async (req, res, next) => {
  const chatId = req.body.chatId || req.query.chatId;
  // console.log("storechatId");
  if (chatId) {
    // const chatId = await getChatByNameController(chatId);
    req.session.chatId = chatId;
    // console.log(req.session.chatId);
    res.status(200).json({ message: "chatId stored successfully" });
  } else {
    // console.log("false");
    res.status(400).json({ message: "No chatId provided" });
  }
});

// router.get("/:id", async (req, res) => {
//   try {
//     const chat = await getChatByIdController(req, res);
//     if (chat) {
//       res.status(200).send(chat);
//     } else {
//       res.status(404).send({ error: "Chat not found" });
//     }
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });

// router.get("/name/:name", async (req, res) => {
//   try {
//     const chat = await getChatByNameController(req, res);
//     if (chat) {
//       res.status(200).send(chat);
//     } else {
//       res.status(404).send({ error: "Chat not found" });
//     }
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });

module.exports = router;
