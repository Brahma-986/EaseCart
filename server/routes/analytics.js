const express = require('express');
const { getReports } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/reports', protect, authorize('manager', 'admin'), getReports);

module.exports = router;
