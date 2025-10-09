const express = require("express");
const {
  createSuperUser,
  createUser,
  login,
  refreshToken,
  logout_user,
  detect_Superuser,
  getAllUsers,
} = require("../controller/UserController");
const router = express.Router();
const { protected } = require("../middleware/protect");

router.post("/create-super-user", createSuperUser);
router.post("/login", login);
router.get("/refresh", refreshToken);
router.get("/logout", logout_user);
router.get("/detect-superuser", detect_Superuser);

// PROTECTED ROUTES
router.post("/create-users", protected, createUser);
router.get("/get-users/:search", protected, getAllUsers);

module.exports = router;
