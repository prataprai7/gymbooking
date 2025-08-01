const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { auth, requireGymOwner, requireAdmin } = require('../middleware/auth');
const { uploadGymImages, handleUploadError } = require('../middleware/upload');
const gymController = require('../controllers/gymController');

const router = express.Router();


const createGymValidation = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Gym name must be between 2 and 100 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required'),
  body('address')
    .notEmpty()
    .withMessage('Address is required'),
  body('city')
    .notEmpty()
    .withMessage('City is required'),
  body('phone')
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 digits'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  body('monthlyPrice')
    .optional()
    .isNumeric()
    .withMessage('Monthly price must be a number'),
  body('annualPrice')
    .optional()
    .isNumeric()
    .withMessage('Annual price must be a number'),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];

// Gym update validation
const updateGymValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Gym name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 digits'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
];

// Public routes
router.get('/', gymController.getAllGyms);
router.get('/:id', gymController.getGymById);

// Protected routes
router.post('/', auth, requireGymOwner, uploadGymImages, handleUploadError, gymController.createGym);
router.put('/:id', auth, updateGymValidation, validate, gymController.updateGym);
router.delete('/:id', auth, gymController.deleteGym);
router.get('/owner/my-gyms', auth, requireGymOwner, gymController.getGymsByOwner);
router.get('/owner/bookings', auth, requireGymOwner, gymController.getOwnerBookings);
router.patch('/:id/status', auth, gymController.updateGymStatus);

module.exports = router; 