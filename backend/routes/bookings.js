const express = require('express');
const { body } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
  getGymBookings
} = require('../controllers/bookingController');

const router = express.Router();

// Booking creation validation
const createBookingValidation = [
  body('gymId')
    .isUUID()
    .withMessage('Valid gym ID is required'),
  body('startDate')
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('endDate')
    .isISO8601()
    .withMessage('Valid end date is required'),
  body('totalPrice')
    .isFloat({ min: 0 })
    .withMessage('Total price must be a positive number'),
  body('specialRequests')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Special requests must be less than 500 characters'),
  body('paymentMethod')
    .optional()
    .isIn(['credit_card', 'debit_card', 'paypal', 'cash'])
    .withMessage('Invalid payment method')
];

// Update booking status validation
const updateBookingStatusValidation = [
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid booking status'),
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'paid', 'failed', 'refunded'])
    .withMessage('Invalid payment status')
];

// Cancel booking validation
const cancelBookingValidation = [
  body('cancellationReason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cancellation reason must be less than 500 characters')
];

// User routes (authenticated users)
router.post('/', auth, createBookingValidation, validate, createBooking);
router.get('/my-bookings', auth, getUserBookings);
router.get('/my-bookings/:id', auth, getBookingById);
router.put('/my-bookings/:id/cancel', auth, cancelBookingValidation, validate, cancelBooking);

// Gym owner routes
router.get('/gym/:gymId', auth, authorize('gym_owner', 'admin'), getGymBookings);
router.put('/:id/status', auth, authorize('gym_owner', 'admin'), updateBookingStatusValidation, validate, updateBookingStatus);

module.exports = router; 