const express = require("express");
const router = express.Router();
const { create } = require("../controllers/usersController");
const checkAbilities = require("../Middlewares/checkAbilities");

router.use(express.json());

const dynamicCheckAbilities = (req, res, next) => {
  const user = req.body;
  if (!user || !user.role) {
    return res.status(403).send({ message: "User not authenticated" });
  }
  let subject;
  switch (user.role) {
    case "Client":
      subject = "Clients";
      break;
    case "Admin":
    case "Role 1":
    case "Role 2":
    default:
      subject = "Employees";
      break;
  }
  const abilityMiddleware = checkAbilities("create", subject);
  abilityMiddleware(req, res, next);
};

router.post("/", dynamicCheckAbilities, async (req, res) => {
  try {
    const response = await create(req.body.userName, req.body.password, req.body.employeType, req.body.role);
    res.status(201).send(response);
  } catch (err) {
    if (err.message == "UserName already exist")
      res.status(400).send({ message: "UserName already exist" });
    else res.status(500).send({ message: "Fail to fetch: " + err.message });
  }
});

module.exports = router;
