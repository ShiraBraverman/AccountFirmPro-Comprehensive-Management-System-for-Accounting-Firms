const extendSession = (req, res, next) => {
    if (req.session.user) {
      req.session.touch();
    }
    next();
  };

module.exports = extendSession