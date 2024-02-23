import getRegisterUsers = require("./users/userManagement/registerUsers");
import setEmailVerification = require("./users/userManagement/VerifyUserEmail");
import setLoggedInUser = require("./users/userManagement/loginUser");
import getRegisterBots = require("./users/botManagment/createBots");
import messaging = require("./users/botManagment/messagingChatBot");
import trainBot = require("./users/botManagment/uploadFiles");
import fetchSingleBot = require("./users/botManagment/fetchUserBot");

module.exports = {
  getRegisterUsers,
  setEmailVerification,
  setLoggedInUser,
  getRegisterBots,
  messaging,
  trainBot,
  fetchSingleBot,
};
