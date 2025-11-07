const express = require("express");
const router = express.Router();
const { protected } = require("../middleware/protect");
const {
  create_document,
  get_single_document,
} = require("../controller/DocumentsController");

router.post("/create-document", protected, create_document);
router.get("/get-single-document", protected, get_single_document);

module.exports = router;
