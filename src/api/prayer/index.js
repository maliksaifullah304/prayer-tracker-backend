const express = require('express');
const {updatePrayerStatus, getPrayer} = require('./prayer.controller');
const router = express.Router();
router.patch('/status', updatePrayerStatus);
router.get('/', getPrayer);
module.exports = router;
