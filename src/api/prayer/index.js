const express = require('express');
const {updatePrayerStatus} = require('./prayer.controller');
const router = express.Router();
router.patch('/status', updatePrayerStatus);
module.exports = router;
