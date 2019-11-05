const express = require('express');
const router = express.Router();

let { allAuth, adminAuth } = require('../config/auth');

let {
  register,
  login,
  profile,
  deleteUser
} = require('../controllers/user_controller')

router.post('/register', register);
router.post('/login', login);
router.get('/profile', allAuth, profile);
router.get('/delete/:id', adminAuth, deleteUser);

module.exports = router;