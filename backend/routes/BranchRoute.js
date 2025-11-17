const express = require("express");
const router = express.Router();
const { protected } = require("../middleware/protect");
const { create_branch, get_branch } = require("../controller/BranchController");

router.post("/create-branch", protected, create_branch);
router.get("/get-branch", protected, get_branch);

module.exports = router;
