import { Moment } from "moment";

type botType = {
  botId: string;
  ownerId: string;
  botName: string;
  description: string;
  creationDate: any;
  active: boolean;
  userLevel: "admin" | "user";
};

type loginData = {
  email: string;
  password: string;
};

type signinData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type subscriptionPlan = {
  subscriptionId: string;
  planName: "Standard" | "Premium" | "Ultimate";
  tokenAllowance: number;
  botsAllowed: number;
  startDate: Moment;
  EndDate: Moment;
  tokenUsed: number;
};

type dataSource = { type: string; data: any; botId: string };
