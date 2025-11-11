const express = require("express");
const router = express.Router();
const { protected } = require("../middleware/protect");
const {
  get_signatories,
  create_signatory,
  reorder_signatory,
  remove_signatory,
} = require("../controller/SignatoriesController");

router.get("/get-all-signatory", protected, get_signatories);
router.post("/create-signatory", protected, create_signatory);
router.put("/re-order-signatory", protected, reorder_signatory);
router.delete("/remove-signatory/:ID", protected, remove_signatory);

module.exports = router;
