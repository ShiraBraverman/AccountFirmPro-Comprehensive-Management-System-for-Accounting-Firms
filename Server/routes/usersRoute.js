const express = require("express");
const router = express.Router();
const { getById, update, getManagers} = require("../controllers/usersController");
const checkAbilities = require("../Middlewares/checkAbilities");
const checkEmail = require("../Middlewares/emailVerify");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/user", checkAbilities("read", "Clients"), async (req, res) => {
  try {
    const id = req.query.id;
    const result = await getById(id);
    checkAbilities("read", result.role);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.put("/user", checkEmail, checkAbilities("update", "Users"), async (req, res) => {
  try {
    const id = req.query.id;
    const userName = req.body.userName;
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const street = req.body.street;
    const city = req.body.city;
    const zipcode = req.body.zipcode;
    if (!userName || !name || !email || !street || !phone || !city || !zipcode) {
      return res.status(400).json({ success: false, message: "Necessary details to update the user are missing" });
    }
    await update(id, userName, name, email, phone, street, city, zipcode);
    const result = await getById(id);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get("/chatMembers", checkAbilities("create", "Chat"), async (req, res) => {
  try {
    const id = req.query.id;
    const members = await getManagers(id);
    res.status(200).send([members]);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
