import { v4 as uuidv4 } from "uuid";
const moment = require("moment");

const normalUUid = uuidv4();

export const firstMightyUser = {
  _id: normalUUid,
  userId: normalUUid,
  firstname: "Olamide",
  lastname: "Faniyan",
  phoneNo: "07533925563",
  email: "faniyano@gmail.com",
  emailVerification: false,
  signUpDate: moment().format(),
  lastActive: moment().format(),
  password: "mideMighty001%",
  preferences: [
    {
      _id: uuidv4(),
      theme: "dark",
    },
  ],
  subscriptionPlan: {
    subscriptionId: uuidv4(),
    planName: "Premium",
    tokenAllowance: 5000,
    botsAllowed: 5,
    startDate: moment().format(),
    EndDate: moment().add(1, "months").format(),
    tokenUsed: 1000,
  },
  bots: [
    {
      _id: uuidv4(),
      botName: "Mighty",
      botPicture: "",
    },
  ],
};
