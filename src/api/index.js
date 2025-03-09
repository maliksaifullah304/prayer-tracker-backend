const express = require('express');
const router = express.Router();
const auth = require('./auth');
const prayer = require('./prayer');
const {authenticateUser} = require('../middleware/authMiddleware');

router.use('/auth', auth);
router.use('/prayer', authenticateUser, prayer);

module.exports = router;
