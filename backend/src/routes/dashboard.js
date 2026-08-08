const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');

// Dashboard statistics routes
router.get('/stats', authenticateUser, (req, res) => {
  res.status(200).json({ message: 'Dashboard statistics endpoint - To be implemented' });
});

router.get('/recent-activities', authenticateUser, (req, res) => {
  res.status(200).json({ message: 'Recent activities endpoint - To be implemented' });
});

module.exports = router;