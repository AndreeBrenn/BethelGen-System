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
  get_items,
  get_stocks,
  update_item,
  replenish_stock,
  delete_item,
  create_inventory_request,
  get_inventory_request_personal,
  delete_request_inventory,
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
router.get("/get-items", protected, get_items);
router.get("/get-stocks", protected, get_stocks);
router.put("/update-item", protected, update_item);
router.post("/replenish-stocks", protected, replenish_stock);
router.delete("/delete-item/:ID", protected, delete_item);

//INVENTORY REQUEST
router.post("/create-request", protected, create_inventory_request);
router.get("/get-personal-request", protected, get_inventory_request_personal);
router.delete(
  "/delete-personal-request/:ID",
  protected,
  delete_request_inventory
);

module.exports = router;
