const express = require("express");
const router = express.Router();

let {
  pgs,
  addPg,
  updatePg,
  deletePg,
  showAvailablePgs,
  bookPg,
  returnPg,
  viewPg,
  duePayment,
  allPaymentDues
} = require("../controllers/pg_controller");

let {
  adminAuth,
  ownerAuth,
  tenantAuth,
  allAuth,
  someAuth
} = require("../config/auth");

router.get("/", allAuth, pgs);
router.post("/add", ownerAuth, addPg);
// router.post('/update/:id', ownerAuth, updatePg);
// router.get('/delete/:id', someAuth, deletePg);
// router.get('/available', allAuth, showAvailablePgs);
// router.post('/book/:id', tenantAuth, bookPg);
// router.get('/return/:id', ownerAuth, returnPg);
// router.get('/:id', allAuth, viewPg);
// router.get('/due/:id', ownerAuth, duePayment);
// router.get('/dues', adminAuth, allPaymentDues);

module.exports = router;
