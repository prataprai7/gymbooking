const { Membership, User, Gym } = require('../models');

const getUserMemberships = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: memberships } = await Membership.findAndCountAll({
      where: { userId, isActive: true },
      include: [
        {
          model: Gym,
          as: 'gym',
          attributes: ['id', 'name', 'address', 'city', 'images']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      memberships,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user memberships error:', error);
    res.status(500).json({
      error: 'Failed to fetch memberships',
      details: error.message
    });
  }
};

// Get a specific membership
const getMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const membership = await Membership.findOne({
      where: { id, userId },
      include: [
        {
          model: Gym,
          as: 'gym',
          attributes: ['id', 'name', 'address', 'city', 'images', 'phone', 'email']
        }
      ]
    });

    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    res.json({ membership });
  } catch (error) {
    console.error('Get membership error:', error);
    res.status(500).json({
      error: 'Failed to fetch membership',
      details: error.message
    });
  }
};

// Get gym owner's memberships (all memberships for their gyms)
const getOwnerMemberships = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    // Get all gyms owned by the user
    const userGyms = await Gym.findAll({
      where: { ownerId: req.user.id },
      attributes: ['id']
    });
    
    const gymIds = userGyms.map(gym => gym.id);
    
    if (gymIds.length === 0) {
      return res.json({ 
        memberships: [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: parseInt(limit)
        }
      });
    }
    
    const { count, rows: memberships } = await Membership.findAndCountAll({
      where: { 
        gymId: { [require('sequelize').Op.in]: gymIds },
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: Gym,
          as: 'gym',
          attributes: ['id', 'name', 'city', 'address']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      memberships,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get owner memberships error:', error);
    res.status(500).json({
      error: 'Failed to fetch memberships',
      details: error.message
    });
  }
};

// Update membership status
const updateMembershipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const userId = req.user.id;

    const membership = await Membership.findOne({
      where: { id, userId }
    });

    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }

    await membership.update({ isActive });

    res.json({
      message: 'Membership status updated successfully',
      membership
    });
  } catch (error) {
    console.error('Update membership status error:', error);
    res.status(500).json({
      error: 'Failed to update membership status',
      details: error.message
    });
  }
};

module.exports = {
  getUserMemberships,
  getMembership,
  getOwnerMemberships,
  updateMembershipStatus
}; 