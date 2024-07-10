const express = require("express");
const router = express.Router();
const {getConnections, createConnection, deleteConnection} = require("../controllers/connectionsController");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
    try {
      const employees = await getConnections();
      res.status(200).send(employees);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

router.post("/",async (req, res) => {
    try {
      const employeeID = req.body.employeeID;
      const clientID = req.body.clientID;

      const connection = await createConnection(employeeID, clientID);
      res.status(200).send(connection);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

router.delete("/", async (req, res) => {
    try {
      const employeeID = req.body.employeeID;
      const clientID = req.body.clientID;
      const connection = await deleteConnection(employeeID, clientID);
      res.status(200).send(connection);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

module.exports = router;
