const express = require("express");
const {
  createSuperUser,
  createUser,
  login,
  refreshToken,
  logout_user,
  detect_Superuser,
  getAllUsers,
  updateUser,
  get_all_users,
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
router.get("/get-users", protected, getAllUsers);
router.put("/update-users", protected, updateUser);
router.get("/get-all-users", protected, get_all_users);

module.exports = router;
