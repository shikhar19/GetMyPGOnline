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
  removeUserBan
} = require("../controllers/user_controller");

router.post("/register", register);
router.post("/login", login);
router.get("/verifyEmail/:email/:token", verifyEmail);
router.get("/profile", allAuth, profile);
router.post("/update", allAuth, updateUser); //krna h check
router.get("/delete/:id", someAuth, deleteUser);
router.get("/removeban/:id", adminAuth, removeUserBan);
router.post("/contactus", adminAuth, deleteUser);

module.exports = router;
