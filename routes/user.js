const express = require('express');
const router = express.Router();

let { allAuth, adminAuth } = require('../config/auth');

let {
  register,
  login,
  profile,
  deleteUser,
  updateUser
} = require('../controllers/user_controller')

router.post('/register', register);
router.post('/login', login);
router.get('/profile', allAuth, profile);
router.post('/update', allAuth, updateUser);
router.get('/delete/:id', adminAuth, deleteUser);

module.exports = router;