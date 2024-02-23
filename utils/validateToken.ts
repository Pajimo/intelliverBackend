import jwt = require("jsonwebtoken");

const parseCookies = (request) => {
  const list = {};
  const cookieHeader = request.cookies;
  console.log(cookieHeader, "cookie header");
  // if (cookieHeader) {
  //   cookieHeader.split(";").forEach(function (cookie) {
  //     const parts = cookie.split("=");
  //     list[parts.shift().trim()] = decodeURI(parts.join("="));
  //   });
  // }

  return list;
};

export const validateToken = async (req) => {
  // const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>
  // const secretKey = process.env.JWT_SECRET_KEY;

  // if (!token) {
  //   context.res = {
  //     status: 401, // Unauthorized
  //     body: "No token provided.",
  //   };
  //   return false;
  // }

  // try {
  //   const decoded = jwt.verify(token, secretKey);
  //   // Token is valid
  //   // You can attach user details to the request if needed
  //   req.user = decoded;
  //   return true;
  // } catch (error) {
  //   context.res = {
  //     status: 403, // Forbidden
  //     body: "Invalid token.",
  //   };
  //   return false;
  // }

  const cookies = parseCookies(req);
  const token = cookies["token"]; // Assuming you've stored the token in a cookie named 'token'

  if (!token) {
    // console.log("no token provided");
    // throw new Error("No token provided");
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      return decoded; // Contains the payload of the token if verification is successful
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
};

// const isValid = await validateToken(req, context);
// if (!isValid) return; // Stop execution if the token is not valid
