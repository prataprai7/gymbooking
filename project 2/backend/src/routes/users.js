const express = require('express');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();


router.get('/profile', auth, (req, res) => {
  res.json({ user: req.user.getPublicProfile() });
});

router.get('/admin/users', auth, requireAdmin, (req, res) => {

  res.json({ message: 'Admin user management endpoint' });
});

module.exports = router; 