const express = require("express");
const router = express.Router();
const {
  getClientsEmployee,
  getClients,
  getClientByCkientId,
} = require("../controllers/clientsController");
const {
  getById} = require("../controllers/usersController");

const checkAbilities = require("../Middlewares/checkAbilities");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get("/client", checkAbilities("read", "Clients"), async (req, res) => {
  try {
    const id = req.query.id;
    // console.log(id)
    const result = await getClientByCkientId(id);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get(
  "/clients",
  checkAbilities("create", "Clients"),
  async (req, res) => {
    try {
      const id = req.query.id;
      let clientOfEmployee = null;
      if (id == null) clientOfEmployee = await getClients();
      else {
        const user = await getById(id);
        if (user.role == "Admin") clientOfEmployee = await getClients();
        else {
          clientOfEmployee = await getClientsEmployee(id);
        }
      }
      res.status(200).send(clientOfEmployee);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  }
);

module.exports = router;
