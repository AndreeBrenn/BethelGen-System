const express = require("express");
const router = express.Router();
const { protected } = require("../middleware/protect");
const {
  create_category,
  get_category,
  create_subcategory,
  create_classification,
  update_category,
  update_subcategory,
  delete_category,
  delete_subcategory,
} = require("../controller/InventoryController");

router.post("/create-category", protected, create_category);
router.get("/get-category", protected, get_category);
router.put("/update-category", protected, update_category);
router.post("/create-subcategory", protected, create_subcategory);
router.post("/create-classification", protected, create_classification);
router.put("/update-subcategory", protected, update_subcategory);
router.delete("/delete-category/:ID", protected, delete_category);
router.delete("/delete-subcategory/:ID", protected, delete_subcategory);

module.exports = router;
