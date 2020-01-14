const express = require("express");
const router = express.Router();

let { allAuth, adminAuth, someAuth } = require("../config/auth");

const imgupload = require("../config/imgUpload");

let {
  register,
  login,
  verifyEmail,
  verifyContact,
  retryContactVerification,
  sendForgetEmail,
  forgetPassword,
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
router.get("/forgetpassword/:emailormobile", sendForgetEmail);
router.post("/forgetpassword/:id/:email", forgetPassword);
router.post("/update", allAuth, imgupload.upload.single("image"), updateUser);
router.get("/delete/:id/:email", someAuth, deleteUser); //
router.post("/requestremoveban/:email", requestRemoveBan);
router.get("/removeban/:id", adminAuth, removeUserBan);

module.exports = router;
