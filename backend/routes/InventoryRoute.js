const express = require("express");
const router = express.Router();
const { protected } = require("../middleware/protect");
const multer = require("multer");
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
  get_all_request,
  update_request,
  get_documents,
  get_filtered_items,
  ship_items,
  get_inventory_shipped_items,
  get_pending,
  get_branch_items,
  get_stocks_branch,
  get_shipped_or_received_items,
  get_serial_automatic,
} = require("../controller/InventoryController");
const { uploadSupportingForms } = require("../middleware/multerUploading");

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
router.get("/get-documents", protected, get_documents);
router.put("/update-item", protected, update_item);
router.post("/replenish-stocks", protected, replenish_stock);
router.delete("/delete-item/:ID", protected, delete_item);
router.get("/get-filtered-items", protected, get_filtered_items);
router.get("/get-branch-items", protected, get_branch_items);
router.get("/get-stocks-branch", protected, get_stocks_branch);

//INVENTORY REQUEST
router.post("/create-request", protected, create_inventory_request);
router.get("/get-personal-request", protected, get_inventory_request_personal);
router.delete(
  "/delete-personal-request/:ID",
  protected,
  delete_request_inventory
);
router.get("/get-all-request", protected, get_all_request);
router.put("/update-request", protected, uploadSupportingForms, update_request);
router.get("/pending-for-me", protected, get_pending);

//SHIP ITEMS
router.put("/ship-items", protected, ship_items);
router.post("/get-shipped-items", protected, get_inventory_shipped_items);
router.get(
  "/get-stocks-for-ship-or-received",
  protected,
  get_shipped_or_received_items
);
router.get("/get-serial-automatic", protected, get_serial_automatic);

module.exports = router;
