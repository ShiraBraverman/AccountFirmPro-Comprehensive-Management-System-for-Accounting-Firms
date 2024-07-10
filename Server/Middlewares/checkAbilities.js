const { ForbiddenError } = require("@casl/ability");
const { defineAbilitiesFor } = require("./abilities");

const checkAbilities = (action, subject) => (req, res, next) => {
  const user = req.session.user;
  const ability = defineAbilitiesFor(user.role);
  try {
    ForbiddenError.from(ability).throwUnlessCan(action, subject);
    next();
  } catch (error) {
    res.status(403).send({ message: "Access Denied", error: error.message });
  }
};

module.exports = checkAbilities;
