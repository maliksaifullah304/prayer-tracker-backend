const express = require('express');
const {createUser, login, deActivateUser} = require('./auth.controller');
const {
  adminAccessMiddleware,
} = require('../../middleware/adminAccessMiddleware');

const router = express.Router();
router.route('/register').post(createUser);
router.route('/login').post(login);
router.patch('deactivate', adminAccessMiddleware, deActivateUser);
module.exports = router;
