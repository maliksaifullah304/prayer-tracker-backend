const express = require('express');
const {
  createGuidance,
  updateGuidance,
  getAllGuidance,
  deleteGuidance,
} = require('./guidance.controller');
const {
  adminAccessMiddleware,
} = require('../../middleware/adminAccessMiddleware');

const router = express.Router();

router.route('/').get(getAllGuidance);
// Protect all guidance routes: only admins
router.use(adminAccessMiddleware);

router.route('/').post(createGuidance);
router.route('/:id').patch(updateGuidance).delete(deleteGuidance);

module.exports = router;
