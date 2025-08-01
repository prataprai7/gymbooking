const express = require('express');
const { body } = require('express-validator');
const { auth, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  getAllGyms,
  getGymById,
  createGym,
  updateGym,
  deleteGym,
  getGymsByOwner
} = require('../controllers/gymController');

const router = express.Router();

// Gym creation validation
const createGymValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Gym name is required and must be less than 100 characters'),
  body('address')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Address is required and must be less than 200 characters'),
  body('city')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('City is required and must be less than 50 characters'),
  body('state')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('State is required and must be less than 50 characters'),
  body('zipCode')
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Zip code is required and must be less than 10 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
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

// Update gym validation
const updateGymValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Gym name must be less than 100 characters'),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Address must be less than 200 characters'),
  body('city')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('City must be less than 50 characters'),
  body('state')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('State must be less than 50 characters'),
  body('zipCode')
    .optional()
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Zip code must be less than 10 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
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
router.get('/', getAllGyms);
router.get('/:id', getGymById);

// Protected routes
router.get('/owner/my-gyms', auth, authorize('gym_owner', 'admin'), getGymsByOwner);
router.post('/', auth, authorize('gym_owner', 'admin'), createGymValidation, validate, createGym);
router.put('/:id', auth, authorize('gym_owner', 'admin'), updateGymValidation, validate, updateGym);
router.delete('/:id', auth, authorize('gym_owner', 'admin'), deleteGym);

module.exports = router; 