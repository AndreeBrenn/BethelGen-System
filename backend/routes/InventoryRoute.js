const express = require("express");
const router = express.Router();
const { protected } = require("../middleware/protect");
const {
  create_category,
  get_category,
} = require("../controller/InventoryController");

router.post("/create-category", protected, create_category);
router.get("/get-category", protected, get_category);

module.exports = router;
