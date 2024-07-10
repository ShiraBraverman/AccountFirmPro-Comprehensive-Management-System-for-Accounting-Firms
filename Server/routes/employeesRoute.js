const express = require("express");
const router = express.Router();
const {getEmployees} = require("../controllers/employeeController");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/employees", async (req, res) => {
    try {
      const employees = await getEmployees();
      res.status(200).send(employees);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

module.exports = router;