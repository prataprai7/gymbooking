const express = require('express');
const { Op } = require('sequelize');
const { User, Gym, Membership, Review } = require('../models');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Admin dashboard stats
router.get('/stats', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'customer' } });
    const totalGymOwners = await User.count({ where: { role: 'gym_owner' } });
    const totalGyms = await Gym.count({ where: { isActive: true } });
    const totalMemberships = await Membership.count();
    const activeMemberships = await Membership.count({
      where: { 
        status: 'active',
        endDate: { [Op.gt]: new Date() }
      }
    });
    const totalRevenue = await Membership.sum('price', {
      where: { paymentStatus: 'paid' }
    });

    // Monthly stats
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyUsers = await User.count({
      where: {
        createdAt: { [Op.gte]: currentMonth },
        role: 'customer'
      }
    });

    const monthlyMemberships = await Membership.count({
      where: {
        createdAt: { [Op.gte]: currentMonth },
        paymentStatus: 'paid'
      }
    });

    const monthlyRevenue = await Membership.sum('price', {
      where: {
        createdAt: { [Op.gte]: currentMonth },
        paymentStatus: 'paid'
      }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalGymOwners,
        totalGyms,
        totalMemberships,
        activeMemberships,
        totalRevenue: totalRevenue || 0,
        monthly: {
          users: monthlyUsers,
          memberships: monthlyMemberships,
          revenue: monthlyRevenue || 0
        }
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin stats'
    });
  }
});

// Get all users
router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: users.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(users.count / limit),
        totalItems: users.count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get all gyms
router.get('/gyms', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;
    if (status === 'verified') where.isVerified = true;
    if (status === 'unverified') where.isVerified = false;
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { city: { [Op.iLike]: `%${search}%` } },
        { district: { [Op.iLike]: `%${search}%` } }
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
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: gyms.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(gyms.count / limit),
        totalItems: gyms.count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gyms'
    });
  }
});

// Verify gym
router.put('/gyms/:id/verify', auth, authorize('admin'), async (req, res) => {
  try {
    const gym = await Gym.findByPk(req.params.id);
    
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    await gym.update({ isVerified: true });

    res.json({
      success: true,
      message: 'Gym verified successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify gym'
    });
  }
});

// Feature gym
router.put('/gyms/:id/feature', auth, authorize('admin'), async (req, res) => {
  try {
    const { isFeatured } = req.body;
    const gym = await Gym.findByPk(req.params.id);
    
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    await gym.update({ isFeatured });

    res.json({
      success: true,
      message: `Gym ${isFeatured ? 'featured' : 'unfeatured'} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update gym feature status'
    });
  }
});

// Get all memberships
router.get('/memberships', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;

    const memberships = await Membership.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Gym,
          as: 'gym',
          attributes: ['id', 'name', 'city']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: memberships.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(memberships.count / limit),
        totalItems: memberships.count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch memberships'
    });
  }
});

// Toggle user status
router.put('/users/:id/toggle-status', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ isActive: !user.isActive });

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status'
    });
  }
});

module.exports = router;