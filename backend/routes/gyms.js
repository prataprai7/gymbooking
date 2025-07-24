const express = require('express');
const { Op } = require('sequelize');
const { Gym, User, Review, Membership } = require('../models');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all gyms with filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      city,
      district,
      minPrice,
      maxPrice,
      rating,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { isActive: true };

    // Apply filters
    if (city) where.city = { [Op.iLike]: `%${city}%` };
    if (district) where.district = { [Op.iLike]: `%${district}%` };
    if (minPrice) where.monthlyPrice = { [Op.gte]: minPrice };
    if (maxPrice) where.monthlyPrice = { ...where.monthlyPrice, [Op.lte]: maxPrice };
    if (rating) where.rating = { [Op.gte]: rating };
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const gyms = await Gym.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: gyms.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(gyms.count / limit),
        totalItems: gyms.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get gyms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gyms'
    });
  }
});

// Get featured/boosted gyms
router.get('/featured', async (req, res) => {
  try {
    const gyms = await Gym.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { isFeatured: true },
          { 
            isBoosted: true,
            boostExpiresAt: { [Op.gt]: new Date() }
          }
        ]
      },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['isBoosted', 'DESC'], ['rating', 'DESC']],
      limit: 6
    });

    res.json({
      success: true,
      data: gyms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured gyms'
    });
  }
});

// Get gym by ID
router.get('/:id', async (req, res) => {
  try {
    const gym = await Gym.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: Review,
          as: 'reviews',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'avatar']
            }
          ],
          where: { isActive: true },
          required: false,
          order: [['createdAt', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    res.json({
      success: true,
      data: gym
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gym details'
    });
  }
});

// Create gym (gym owners only)
router.post('/', auth, authorize('gym_owner', 'admin'), async (req, res) => {
  try {
    const gymData = {
      ...req.body,
      ownerId: req.user.id
    };

    const gym = await Gym.create(gymData);

    res.status(201).json({
      success: true,
      message: 'Gym created successfully',
      data: gym
    });
  } catch (error) {
    console.error('Create gym error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create gym'
    });
  }
});

// Update gym
router.put('/:id', auth, async (req, res) => {
  try {
    const gym = await Gym.findByPk(req.params.id);
    
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check ownership or admin
    if (gym.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await gym.update(req.body);

    res.json({
      success: true,
      message: 'Gym updated successfully',
      data: gym
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update gym'
    });
  }
});

// Delete gym
router.delete('/:id', auth, async (req, res) => {
  try {
    const gym = await Gym.findByPk(req.params.id);
    
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check ownership or admin
    if (gym.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await gym.update({ isActive: false });

    res.json({
      success: true,
      message: 'Gym deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete gym'
    });
  }
});

// Boost gym (gym owners only)
router.post('/:id/boost', auth, authorize('gym_owner'), async (req, res) => {
  try {
    const { duration = 30 } = req.body; // duration in days
    const gym = await Gym.findByPk(req.params.id);
    
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    if (gym.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const boostExpiresAt = new Date();
    boostExpiresAt.setDate(boostExpiresAt.getDate() + duration);

    await gym.update({
      isBoosted: true,
      boostExpiresAt
    });

    res.json({
      success: true,
      message: 'Gym boosted successfully',
      data: gym
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to boost gym'
    });
  }
});

module.exports = router;