const { ForbiddenError } = require("@casl/ability");
const { defineAbilitiesFor } = require("./abilities");

const checkAbilities = (action, subject) => (req, res, next) => {
  const user = req.session.user;
  const ability = defineAbilitiesFor(user.role);
  // console.log(user);
  // console.log(action);
  // console.log(subject);
  try {
    ForbiddenError.from(ability).throwUnlessCan(action, subject);
    // console.log("CAN");
    next();
  } catch (error) {
    // console.log("CANNOT");
    res.status(403).send({ message: "Access Denied", error: error.message });
  }
};

module.exports = checkAbilities;
