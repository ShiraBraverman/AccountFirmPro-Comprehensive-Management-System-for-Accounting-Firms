const express = require("express");
const router = express.Router();
const { create } = require("../controllers/usersController");
const dynamicCheckAbilities = require("../Middlewares/dynamicCheckAbilities");

router.use(express.json());

router.post("/", dynamicCheckAbilities, async (req, res) => {
  try {
    const userName = req.body.userName;
    const password = req.body.password;
    const role = req.body.userRole;
    const employeeType = req.body.employeeType;
    if ( (!userName || !password || !role) && (role == "Employee" && !employeeType) ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Necessary details to update the user are missing",
        });
    }
    const response = await create(userName, password, employeeType, role);
    res.status(201).send(response);
  } catch (err) {
    if (err.message == "UserName already exist")
      res.status(400).send({ message: "UserName already exist" });
    else res.status(500).send({ message: "Fail to fetch: " + err.message });
  }
});

module.exports = router;
