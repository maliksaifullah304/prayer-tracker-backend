const express = require('express');
const {
  createUser,
  login,
  deActivateUser,
  getAllUsers,
  activateUser,
  logout,
} = require('./auth.controller');
const {
  adminAccessMiddleware,
} = require('../../middleware/adminAccessMiddleware');
const {authenticateUser} = require('../../middleware/authMiddleware');

const router = express.Router();
router.route('/register').post(createUser);
router.route('/login').post(login);
router.post('/logout', logout);
router.use(authenticateUser, adminAccessMiddleware);
router.patch('/deactivate/:id', deActivateUser);
router.patch('/activate/:id', activateUser);
router.get('/users', getAllUsers);
module.exports = router;
