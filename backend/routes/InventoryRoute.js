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
  create_Inventory_item,
  get_all_category,
} = require("../controller/InventoryController");

router.post("/create-category", protected, create_category);
router.get("/get-category", protected, get_category);
router.put("/update-category", protected, update_category);
router.post("/create-subcategory", protected, create_subcategory);
router.get("/get-all-category", protected, get_all_category);
router.post("/create-classification", protected, create_classification);
router.put("/update-subcategory", protected, update_subcategory);
router.delete("/delete-category/:ID", protected, delete_category);
router.delete("/delete-subcategory/:ID", protected, delete_subcategory);

//INVENTORY ITEMS / STOCKS
router.post("/create-item", protected, create_Inventory_item);

module.exports = router;
