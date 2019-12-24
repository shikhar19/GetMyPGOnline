const express = require("express");
const router = express.Router();

let { allAuth, adminAuth, someAuth } = require("../config/auth");

let {
  register,
  login,
  verifyEmail,
  profile,
  deleteUser,
  updateUser,
  removeUserBan,
  requestRemoveBan
} = require("../controllers/user_controller");

router.post("/register", register);
router.post("/login", login);
router.get("/verifyEmail/:email/:token", verifyEmail);
router.get("/profile", allAuth, profile);
router.post("/update", allAuth, updateUser);
router.get("/delete/:id", someAuth, deleteUser);
router.get("/removeban/:id", adminAuth, removeUserBan);
router.post("/requestremoveban/:email", requestRemoveBan);

module.exports = router;
