const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const { auth, requireGymOwner } = require('../middleware/auth');

router.use(auth);


router.get('/user', membershipController.getUserMemberships);
router.get('/user/:id', membershipController.getMembership);
router.put('/user/:id/status', membershipController.updateMembershipStatus);

router.get('/owner', requireGymOwner, membershipController.getOwnerMemberships);



module.exports = router; 