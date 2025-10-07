const express = require("express");
const {
  createSuperUser,
  createUser,
  login,
  refreshToken,
  logout_user,
} = require("../controller/UserController");
const router = express.Router();

router.post("/create-super-user", createSuperUser);
router.post("/create-users", createUser);
router.post("/login", login);
router.get("/refresh", refreshToken);
router.get("/logout", logout_user);

module.exports = router;
