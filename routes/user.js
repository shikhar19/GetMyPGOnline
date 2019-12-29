const express = require("express");
const router = express.Router();

let {
  allAuth,
  adminAuth,
  restrictedAuth,
  someAuth
} = require("../config/auth");

let {
  register,
  login,
  verifyEmail,
  verifyContact,
  retryContactVerification,
  profile,
  deleteUser,
  updateUser,
  removeUserBan,
  requestRemoveBan
} = require("../controllers/user_controller");

router.post("/register", register);
router.post("/login", login);
router.get("/verifyEmail/:email/:token", verifyEmail);
router.post("/verifyMobile/:contact", verifyContact);
router.get("/retryVerification/:contact", retryContactVerification);
router.get("/profile", allAuth, profile);
router.post("/update", allAuth, updateUser);
router.get("/delete/:id", restrictedAuth, deleteUser);
router.get("/delete/:id/:email", someAuth, deleteUser);
router.get("/removeban/:id", adminAuth, removeUserBan);
router.post("/requestremoveban/:email", requestRemoveBan);

module.exports = router;
