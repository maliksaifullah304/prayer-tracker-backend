const express = require('express');
const {
  createUser,
  login,
  deActivateUser,
  getAllUsers,
} = require('./auth.controller');
const {
  adminAccessMiddleware,
} = require('../../middleware/adminAccessMiddleware');
const {authenticateUser} = require('../../middleware/authMiddleware');

const router = express.Router();
router.route('/register').post(createUser);
router.route('/login').post(login);
router.use(authenticateUser, adminAccessMiddleware);
router.patch('deactivate', deActivateUser);
router.get('/users', getAllUsers);
module.exports = router;
