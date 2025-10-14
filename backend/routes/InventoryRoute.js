const express = require("express");
const router = express.Router();
const { protected } = require("../middleware/protect");
const {
  create_category,
  get_category,
  create_subcategory,
  create_classification,
} = require("../controller/InventoryController");

router.post("/create-category", protected, create_category);
router.get("/get-category", protected, get_category);
router.post("/create-subcategory", protected, create_subcategory);
router.post("/create-classification", protected, create_classification);

module.exports = router;
