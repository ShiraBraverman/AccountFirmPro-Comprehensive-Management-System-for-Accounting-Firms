const express = require("express");
const router = express.Router();

router.get("/getClientID", (req, res) => {
  try {
    if (req.session.clientID) {
      res.status(200).send({ clientID: req.session.clientID });
    } else {
      res.status(404).send({ message: "ClientID not found in session" });
    }
  } catch (error) {
    res.status(500).send({ message: err.message });
  }

});

router.get("/clearClientID", (req, res, next) => {
  try {
    if (req.session.clientID) {
      delete req.session.clientID;
      res.sendStatus(200);
    } else res.sendStatus(404);
  } catch (error) {
    res.status(500).send({ message: err.message });
  }
}
);

router.post("/storeClientID", (req, res, next) => {
    try{
      const clientId = req.body.clientID || req.query.clientID;
      if (clientId) {
        req.session.clientID = clientId;
        res.status(200).json({ message: "ClientID stored successfully" });
      } else {
        res.status(400).json({ message: "No ClientID provided" });
      }
    } catch(error){
      res.status(500).send({ message: err.message });
    }
  }
);

module.exports = router;
