const { Gym, User, Booking } = require('../models');
const { Op } = require('sequelize');

// Get All Gyms
const getAllGyms = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      city, 
      state, 
      minRating,
      amenities,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { isActive: true };

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by city
    if (city) {
      whereClause.city = { [Op.iLike]: `%${city}%` };
    }

    // Filter by state
    if (state) {
      whereClause.state = { [Op.iLike]: `%${state}%` };
    }

    // Filter by minimum rating
    if (minRating) {
      whereClause.rating = { [Op.gte]: parseFloat(minRating) };
    }

    // Filter by amenities
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      whereClause.amenities = { [Op.overlap]: amenitiesArray };
    }

    const { count, rows: gyms } = await Gym.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: gyms,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all gyms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gyms'
    });
  }
};

// Get Single Gym
const getGymById = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findOne({
      where: { id, isActive: true },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: Booking,
          as: 'bookings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName']
            }
          ],
          where: { status: 'confirmed' },
          required: false
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
    console.error('Get gym by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gym'
    });
  }
};

// Create Gym (Gym Owner Only)
const createGym = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      website,
      images,
      amenities,
      latitude,
      longitude,
      openingHours
    } = req.body;

    const gym = await Gym.create({
      name,
      description,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      website,
      images: images || [],
      amenities: amenities || [],
      latitude,
      longitude,
      openingHours,
      ownerId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Gym created successfully',
      data: gym
    });
  } catch (error) {
    console.error('Create gym error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating gym'
    });
  }
};

// Update Gym (Owner Only)
const updateGym = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const gym = await Gym.findOne({
      where: { id, ownerId: req.user.id }
    });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found or you do not have permission to update it'
      });
    }

    await gym.update(updateData);

    res.json({
      success: true,
      message: 'Gym updated successfully',
      data: gym
    });
  } catch (error) {
    console.error('Update gym error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating gym'
    });
  }
};

// Delete Gym (Owner Only)
const deleteGym = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findOne({
      where: { id, ownerId: req.user.id }
    });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found or you do not have permission to delete it'
      });
    }

    // Check if gym has active bookings
    const activeBookings = await Booking.count({
      where: { 
        gymId: id, 
        status: { [Op.in]: ['pending', 'confirmed'] } 
      }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete gym with active bookings'
      });
    }

    await gym.update({ isActive: false });

    res.json({
      success: true,
      message: 'Gym deleted successfully'
    });
  } catch (error) {
    console.error('Delete gym error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting gym'
    });
  }
};

// Get Gyms by Owner
const getGymsByOwner = async (req, res) => {
  try {
    const gyms = await Gym.findAll({
      where: { ownerId: req.user.id },
      include: [
        {
          model: Booking,
          as: 'bookings',
          attributes: ['id', 'status', 'totalPrice', 'createdAt']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: gyms
    });
  } catch (error) {
    console.error('Get gyms by owner error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching owner gyms'
    });
  }
};

module.exports = {
  getAllGyms,
  getGymById,
  createGym,
  updateGym,
  deleteGym,
  getGymsByOwner
}; 