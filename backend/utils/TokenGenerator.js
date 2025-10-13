const jwt = require("jsonwebtoken");

const generate_Access_token = (payload) => {
  return jwt.sign({ ...payload }, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "15m",
    issuer: "http://localhost:3000", // or your app name
  });
};

const generate_refresh_token = (ID) => {
  return jwt.sign({ ID }, process.env.SECRET_REFRESH_TOKEN, {
    expiresIn: "30d",
  });
};

module.exports = { generate_Access_token, generate_refresh_token };
