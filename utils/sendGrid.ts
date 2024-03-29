import { ApiUrl } from "./constants";

export const verifyEmail = (
  firstName: string,
  userEmail: string,
  emailVerificationToken: string
) => {
  const msg = {
    to: `${userEmail}`,
    from: "faniyanolamide@gmail.com",
    templateId: "d-a22086d2c76948fe9a48868ddbe556b4",
    personalizations: [
      {
        to: `${userEmail}`,
        dynamic_template_data: {
          firstName: `${firstName}`,
          buttonUrl: `${ApiUrl}user/verifyEmail?token=${emailVerificationToken}`,
        },
      },
    ],
  };
  return msg;
};
