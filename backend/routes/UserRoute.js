const express = require("express");
const {
  createSuperUser,
  createUser,
  login,
  refreshToken,
  logout_user,
  detect_Superuser,
} = require("../controller/UserController");
const router = express.Router();

router.post("/create-super-user", createSuperUser);
router.post("/create-users", createUser);
router.post("/login", login);
router.get("/refresh", refreshToken);
router.get("/logout", logout_user);
router.get("/detect-superuser", detect_Superuser);

module.exports = router;
