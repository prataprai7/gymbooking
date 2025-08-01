const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth, requireGymOwner } = require('../middleware/auth');


router.use(auth);


router.post('/', bookingController.createBooking);


router.get('/', bookingController.getUserBookings);


router.get('/:id', bookingController.getBooking);


router.put('/:id/status', bookingController.updateBookingStatus);

router.put('/:id/status/owner', requireGymOwner, bookingController.updateBookingStatusByOwner);

router.put('/:id/cancel', bookingController.cancelBooking);

module.exports = router; 