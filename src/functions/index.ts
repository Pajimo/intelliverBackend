const getRegisterUsers = require("./users/userManagement/registerUsers");
const setEmailVerification = require("./users/userManagement/VerifyUserEmail");
const setLoggedInUser = require("./users/userManagement/loginUser");
// const getRegisterBots = require("./users/botManagement/createBots");

require("dotenv").config();

module.exports = {
  getRegisterUsers,
  setEmailVerification,
  setLoggedInUser,
  // getRegisterBots,
};
