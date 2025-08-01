const { Booking, Gym, User } = require('../models');
const { Op } = require('sequelize');

// Create Booking
const createBooking = async (req, res) => {
  try {
    const {
      gymId,
      startDate,
      endDate,
      totalPrice,
      specialRequests,
      paymentMethod
    } = req.body;

    // Validate gym exists and is active
    const gym = await Gym.findOne({
      where: { id: gymId, isActive: true }
    });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found or inactive'
      });
    }

    // Check for booking conflicts
    const conflictingBooking = await Booking.findOne({
      where: {
        gymId,
        userId: req.user.id,
        status: { [Op.in]: ['pending', 'confirmed'] },
        [Op.or]: [
          {
            startDate: { [Op.lte]: new Date(endDate) },
            endDate: { [Op.gte]: new Date(startDate) }
          }
        ]
      }
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a booking for this gym during the selected period'
      });
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      gymId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice,
      specialRequests,
      paymentMethod
    });

    // Fetch booking with related data
    const bookingWithDetails = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Gym,
          as: 'gym',
          attributes: ['id', 'name', 'address', 'city', 'state']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: bookingWithDetails
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking'
    });
  }
};

// Get User's Bookings
const getUserBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { userId: req.user.id };
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Gym,
          as: 'gym',
          attributes: ['id', 'name', 'address', 'city', 'state', 'images']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
};

// Get Single Booking
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      where: { id, userId: req.user.id },
      include: [
        {
          model: Gym,
          as: 'gym',
          attributes: ['id', 'name', 'address', 'city', 'state', 'phone', 'email', 'images']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
};

// Cancel Booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const booking = await Booking.findOne({
      where: { id, userId: req.user.id }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    // Check if booking is within cancellation window (e.g., 24 hours before start)
    const now = new Date();
    const bookingStart = new Date(booking.startDate);
    const hoursUntilBooking = (bookingStart - now) / (1000 * 60 * 60);

    if (hoursUntilBooking < 24) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking within 24 hours of start date'
      });
    }

    await booking.update({
      status: 'cancelled',
      cancellationReason,
      cancelledAt: new Date(),
      cancelledBy: req.user.id
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking'
    });
  }
};

// Update Booking Status (Admin/Gym Owner)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findOne({
      where: { id },
      include: [
        {
          model: Gym,
          as: 'gym',
          where: { ownerId: req.user.id }
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or you do not have permission to update it'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    await booking.update(updateData);

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking status'
    });
  }
};

// Get Gym Bookings (Gym Owner)
const getGymBookings = async (req, res) => {
  try {
    const { gymId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Verify gym ownership
    const gym = await Gym.findOne({
      where: { id: gymId, ownerId: req.user.id }
    });

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found or you do not have permission to view its bookings'
      });
    }

    const whereClause = { gymId };
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get gym bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gym bookings'
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
  getGymBookings
}; 