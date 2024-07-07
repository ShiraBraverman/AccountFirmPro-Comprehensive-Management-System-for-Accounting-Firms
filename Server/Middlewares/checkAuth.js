const checkAuth = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.status(401).send({ message: "You are not logged in" });
    }
  };

module.exports = checkAuth