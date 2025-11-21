const express = require("express");
const router = express.Router();
const { protected } = require("../middleware/protect");
const {
  create_branch,
  get_branch,
  edit_branch,
  delete_branch,
  get_all_branch,
} = require("../controller/BranchController");

router.post("/create-branch", protected, create_branch);
router.get("/get-branch", protected, get_branch);
router.get("/get-all-branch", protected, get_all_branch);
router.put("/edit-branch", protected, edit_branch);
router.delete("/delete-branch/:ID", protected, delete_branch);

module.exports = router;
