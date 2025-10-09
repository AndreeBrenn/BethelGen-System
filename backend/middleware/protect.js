const jwt = require("jsonwebtoken");

const protected = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get Token
      token = req.headers.authorization.split(" ")[1];

      //Verify
      const decode = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);

      req.user = decode;

      next();
    } catch (error) {
      res.status(403).json({ message: "Token Invalid" });
    }
  }

  if (!token) {
    res.status(403).json({ message: "Not Authorized no TOKEN" });
  }
};

module.exports = {
  protected,
};
