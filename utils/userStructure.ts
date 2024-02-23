import { v4 as uuidv4 } from "uuid";
import moment = require("moment");

const normalUUid = uuidv4();

export const userRegistrationStructure = {
  _id: normalUUid,
  userId: normalUUid,
  firstname: "",
  lastname: "",
  phoneNo: "",
  email: "",
  emailVerification: false,
  signUpDate: moment().format(),
  lastActive: moment().format(),
  password: "",
  preferences: [],
  subscriptionPlan: {},
  bots: [
    {
      _id: uuidv4(),
      botName: "Mighty",
      botPicture: "",
    },
  ],
};

// EndDate: moment().add(1, "months").format(),
