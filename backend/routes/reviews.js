const express = require('express');
const { Review, Gym, User } = require('../models');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Create review
router.post('/', [
  auth,
  body('gymId').isUUID().withMessage('Valid gym ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { gymId, rating, comment } = req.body;

    // Check if gym exists
    const gym = await Gym.findByPk(gymId);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check if user already reviewed this gym
    const existingReview = await Review.findOne({
      where: {
        userId: req.user.id,
        gymId
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this gym'
      });
    }

    const review = await Review.create({
      userId: req.user.id,
      gymId,
      rating,
      comment
    });

    // Update gym rating
    const reviews = await Review.findAll({
      where: { gymId, isActive: true }
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await gym.update({
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length
    });

    const reviewWithUser = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'avatar']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: reviewWithUser
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review'
    });
  }
});

// Get reviews for a gym
router.get('/gym/:gymId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const reviews = await Review.findAndCountAll({
      where: {
        gymId: req.params.gymId,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: reviews.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(reviews.count / limit),
        totalItems: reviews.count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Update review
router.put('/:id', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').isLength({ min: 10, max: 1000 }).withMessage('Comment must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { rating, comment } = req.body;
    
    const review = await Review.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.update({ rating, comment });

    // Update gym rating
    const reviews = await Review.findAll({
      where: { gymId: review.gymId, isActive: true }
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Gym.update(
      {
        rating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length
      },
      { where: { id: review.gymId } }
    );

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
});

// Delete review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.update({ isActive: false });

    // Update gym rating
    const reviews = await Review.findAll({
      where: { gymId: review.gymId, isActive: true }
    });

    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
      
    await Gym.update(
      {
        rating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length
      },
      { where: { id: review.gymId } }
    );

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

module.exports = router;