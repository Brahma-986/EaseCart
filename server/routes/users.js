const express = require('express');
const {
  getUsers,
  getUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get('/stats', getUserStats);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', updateUserStatus);
router.delete('/:id', deleteUser);

module.exports = router;
