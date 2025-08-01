const express = require('express');
const router = express.Router();
const { User, Gym, Membership, Booking } = require('../models');
const { auth, requireAdmin } = require('../middleware/auth');

const adminAuth = [auth, requireAdmin];


router.get('/stats', adminAuth, async (req, res) => {
  try {
   
    const totalUsers = await User.count();
    const totalGymOwners = await User.count({ where: { role: 'gym_owner' } });
    const totalGyms = await Gym.count();
    const totalMemberships = await Membership.count();
    const activeMemberships = await Membership.count({ where: { isActive: true } });

    const memberships = await Membership.findAll({
      attributes: ['price']
    });
    const totalRevenue = memberships.reduce((sum, m) => sum + parseFloat(m.price || 0), 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyUsers = await User.count({
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: thirtyDaysAgo
        }
      }
    });

    const monthlyMemberships = await Membership.count({
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: thirtyDaysAgo
        }
      }
    });

    const monthlyMembershipsData = await Membership.findAll({
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: thirtyDaysAgo
        }
      },
      attributes: ['price']
    });
    const monthlyRevenue = monthlyMembershipsData.reduce((sum, m) => sum + parseFloat(m.price || 0), 0);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalGymOwners,
        totalGyms,
        totalMemberships,
        activeMemberships,
        totalRevenue,
        monthly: {
          users: monthlyUsers,
          memberships: monthlyMemberships,
          revenue: monthlyRevenue
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch admin stats' 
    });
  }
});

// Get all users (admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users' 
    });
  }
});

// Get all gyms (admin only)
router.get('/gyms', adminAuth, async (req, res) => {
  try {
    const gyms = await Gym.findAll({
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: gyms
    });
  } catch (error) {
    console.error('Error fetching gyms:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch gyms' 
    });
  }
});

// Get all memberships (admin only)
router.get('/memberships', adminAuth, async (req, res) => {
  try {
    const memberships = await Membership.findAll({
      include: [
        {
          model: Gym,
          as: 'gym',
          attributes: ['id', 'name', 'city']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: memberships
    });
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch memberships' 
    });
  }
});

module.exports = router; 