const express = require('express');
const { Op } = require('sequelize');
const { Membership, Gym, User } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get user memberships
router.get('/', auth, async (req, res) => {
  try {
    const memberships = await Membership.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Gym,
          as: 'gym',
          attributes: ['id', 'name', 'address', 'city', 'images', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: memberships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch memberships'
    });
  }
});

// Create membership
router.post('/', auth, async (req, res) => {
  try {
    const { gymId, type = 'monthly', paymentMethod } = req.body;

    // Check if gym exists
    const gym = await Gym.findByPk(gymId);
    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found'
      });
    }

    // Check for active membership
    const existingMembership = await Membership.findOne({
      where: {
        userId: req.user.id,
        gymId,
        status: 'active',
        endDate: { [Op.gt]: new Date() }
      }
    });

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active membership for this gym'
      });
    }

    // Calculate dates and price
    const startDate = new Date();
    const endDate = new Date();
    let price;

    if (type === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
      price = gym.monthlyPrice;
    } else if (type === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
      price = gym.yearlyPrice || (gym.monthlyPrice * 10); // 10 months price for yearly
    }

    const membership = await Membership.create({
      userId: req.user.id,
      gymId,
      type,
      startDate,
      endDate,
      price,
      paymentMethod,
      status: 'pending'
    });

    // Include gym details in response
    const membershipWithGym = await Membership.findByPk(membership.id, {
      include: [
        {
          model: Gym,
          as: 'gym',
          attributes: ['id', 'name', 'address', 'city', 'images']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Membership created successfully',
      data: membershipWithGym
    });
  } catch (error) {
    console.error('Create membership error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create membership'
    });
  }
});

// Update membership status (for payment confirmation)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, paymentStatus, transactionId } = req.body;
    
    const membership = await Membership.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found'
      });
    }

    await membership.update({
      status,
      paymentStatus,
      transactionId
    });

    res.json({
      success: true,
      message: 'Membership status updated successfully',
      data: membership
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update membership status'
    });
  }
});

// Cancel membership
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const membership = await Membership.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found'
      });
    }

    await membership.update({
      status: 'cancelled'
    });

    res.json({
      success: true,
      message: 'Membership cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel membership'
    });
  }
});

// Get membership by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const membership = await Membership.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        {
          model: Gym,
          as: 'gym'
        }
      ]
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found'
      });
    }

    res.json({
      success: true,
      data: membership
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch membership'
    });
  }
});

module.exports = router;