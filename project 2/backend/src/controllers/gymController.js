const { Gym, User, Membership, Booking } = require('../models');
const { Op } = require('sequelize');


const getAllGyms = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      state,
      search,
      rating,
      isActive
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

   
    if (city) whereClause.city = { [Op.iLike]: `%${city}%` };
    if (state) whereClause.state = { [Op.iLike]: `%${state}%` };
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';
    if (rating) whereClause.rating = { [Op.gte]: parseFloat(rating) };

   
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { city: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: gyms } = await Gym.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Membership,
          as: 'memberships',
          where: { isActive: true },
          required: false,
          attributes: ['id', 'name', 'price', 'duration', 'durationType']
        }
      ],
      attributes: { exclude: ['ownerId'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      gyms,
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
      error: 'Failed to fetch gyms',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get gym by ID
const getGymById = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: Membership,
          as: 'memberships',
          where: { isActive: true },
          required: false
        }
      ],
      attributes: { exclude: ['ownerId'] }
    });

    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    res.json({ gym });
  } catch (error) {
    console.error('Get gym by ID error:', error);
    res.status(500).json({
      error: 'Failed to fetch gym',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new gym
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
      openingHours,
      facilities,
      latitude,
      longitude,
      monthlyPrice,
      annualPrice
    } = req.body;

    // Basic validation
    if (!name || !description || !address || !city || !state || !phone) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Name, description, address, city, state, and phone are required'
      });
    }

    // Parse facilities if it's a JSON string
    let parsedFacilities = facilities;
    if (typeof facilities === 'string') {
      try {
        parsedFacilities = JSON.parse(facilities);
      } catch (e) {
        parsedFacilities = [];
      }
    }

    // Handle uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Handle empty strings for optional fields
    const gymData = {
      name,
      description,
      address,
      city,
      state,
      zipCode,
      phone,
      openingHours,
      facilities: parsedFacilities,
      images,
      latitude: latitude || null,
      longitude: longitude || null,
      ownerId: req.user.id,
      isActive: true,
      isVerified: false,
      rating: 0,
      totalReviews: 0
    };

    // Add pricing if provided
    if (monthlyPrice) {
      gymData.monthlyPrice = monthlyPrice;
    }
    if (annualPrice) {
      gymData.annualPrice = annualPrice;
    }

    // Only add email and website if they're not empty
    if (email && email.trim() !== '') {
      gymData.email = email;
    }
    if (website && website.trim() !== '') {
      gymData.website = website;
    }

    const gym = await Gym.create(gymData);

    res.status(201).json({
      message: 'Gym created successfully',
      gym
    });
  } catch (error) {
    console.error('Create gym error:', error);
    res.status(500).json({
      error: 'Failed to create gym',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update gym
const updateGym = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const gym = await Gym.findByPk(id);

    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    // Check if user owns the gym or is admin
    if (gym.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this gym' });
    }

    await gym.update(updateData);

    res.json({
      message: 'Gym updated successfully',
      gym
    });
  } catch (error) {
    console.error('Update gym error:', error);
    res.status(500).json({
      error: 'Failed to update gym',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete gym
const deleteGym = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findByPk(id);

    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    // Check if user owns the gym or is admin
    if (gym.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this gym' });
    }

    await gym.destroy();

    res.json({
      message: 'Gym deleted successfully'
    });
  } catch (error) {
    console.error('Delete gym error:', error);
    res.status(500).json({
      error: 'Failed to delete gym',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get gyms by owner
const getGymsByOwner = async (req, res) => {
  try {
    const gyms = await Gym.findAll({
      where: { ownerId: req.user.id },
      include: [
        {
          model: Membership,
          as: 'memberships',
          attributes: ['id', 'name', 'price', 'isActive']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ gyms });
  } catch (error) {
    console.error('Get gyms by owner error:', error);
    res.status(500).json({
      error: 'Failed to fetch gyms',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update gym status
const updateGymStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, isVerified } = req.body;

    const gym = await Gym.findByPk(id);

    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    // Only admin can verify gyms
    if (isVerified !== undefined && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can verify gyms' });
    }

    // Gym owner can only update isActive
    if (req.user.role !== 'admin') {
      await gym.update({ isActive });
    } else {
      await gym.update({ isActive, isVerified });
    }

    res.json({
      message: 'Gym status updated successfully',
      gym
    });
  } catch (error) {
    console.error('Update gym status error:', error);
    res.status(500).json({
      error: 'Failed to update gym status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get bookings for gym owner
const getOwnerBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    // Get all gyms owned by the user
    const userGyms = await Gym.findAll({
      where: { ownerId: req.user.id },
      attributes: ['id']
    });
    
    const gymIds = userGyms.map(gym => gym.id);
    
    if (gymIds.length === 0) {
      return res.json({ 
        bookings: [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: parseInt(limit)
        }
      });
    }
    
    // Build where clause
    const whereClause = {
      gymId: { [Op.in]: gymIds }
    };
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereClause,
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
        },
        {
          model: Membership,
          as: 'membership',
          attributes: ['id', 'name', 'price']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get owner bookings error:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllGyms,
  getGymById,
  createGym,
  updateGym,
  deleteGym,
  getGymsByOwner,
  updateGymStatus,
  getOwnerBookings
}; 