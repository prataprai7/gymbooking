const { Booking, Gym, User, Membership } = require('../models');


const createBooking = async (req, res) => {
  try {
    const {
      gymId,
      membershipId,
      bookingDate,
      startTime,
      endTime,
      notes,
      totalAmount,
      paymentMethod
    } = req.body;

    const userId = req.user.id;


    if (!gymId || !bookingDate || !startTime || !endTime || !totalAmount) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Gym ID, booking date, start time, end time, and total amount are required'
      });
    }


    const gym = await Gym.findByPk(gymId);
    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    if (membershipId) {
      const membership = await Membership.findByPk(membershipId);
      if (!membership) {
        return res.status(404).json({ error: 'Membership not found' });
      }
    }

    const booking = await Booking.create({
      userId,
      gymId,
      membershipId,
      bookingDate,
      startTime,
      endTime,
      notes,
      totalAmount,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Fetch the booking with related data
    const bookingWithDetails = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Gym,
          as: 'gym',
          attributes: ['id', 'name', 'address', 'city', 'images']
        },
        {
          model: Membership,
          as: 'membership',
          attributes: ['id', 'name', 'price', 'duration', 'durationType']
        }
      ]
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: bookingWithDetails
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      error: 'Failed to create booking',
      details: error.message
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const whereClause = { userId };
    if (status) {
      whereClause.status = status;
    }

    const offset = (page - 1) * limit;

    const bookings = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Gym,
          as: 'gym',
          attributes: ['id', 'name', 'address', 'city', 'images', 'phone']
        },
        {
          model: Membership,
          as: 'membership',
          attributes: ['id', 'name', 'price', 'duration', 'durationType']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      bookings: bookings.rows,
      total: bookings.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(bookings.count / limit)
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      details: error.message
    });
  }
};

// Get a specific booking
const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      where: { id, userId },
      include: [
        {
          model: Gym,
          as: 'gym',
          attributes: ['id', 'name', 'address', 'city', 'images', 'phone', 'email']
        },
        {
          model: Membership,
          as: 'membership',
          attributes: ['id', 'name', 'price', 'duration', 'durationType', 'features']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      error: 'Failed to fetch booking',
      details: error.message
    });
  }
};

// Update booking status (for booking owner)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      where: { id, userId }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update booking
    const updateData = { status };
    if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
      updateData.cancelledBy = userId;
      if (cancellationReason) {
        updateData.cancellationReason = cancellationReason;
      }
    }

    await booking.update(updateData);

    res.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      error: 'Failed to update booking',
      details: error.message
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      where: { id, userId }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    await booking.update({
      status: 'cancelled',
      cancelledAt: new Date(),
      cancelledBy: userId,
      cancellationReason
    });

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      error: 'Failed to cancel booking',
      details: error.message
    });
  }
};

// Update booking status (for gym owners)
const updateBookingStatusByOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;
    const userId = req.user.id;

    // Find the booking
    const booking = await Booking.findOne({
      where: { id },
      include: [
        {
          model: Gym,
          as: 'gym',
          attributes: ['id', 'ownerId', 'name']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if the user owns the gym
    if (booking.gym.ownerId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    // Update the booking
    const updateData = { status };
    if (status === 'cancelled' && cancellationReason) {
      updateData.cancellationReason = cancellationReason;
      updateData.cancelledAt = new Date();
      updateData.cancelledBy = userId;
    }

    await booking.update(updateData);

    // If booking is confirmed, create a membership for the user
    if (status === 'confirmed') {
      try {
        // Check if membership already exists for this user and gym
        const existingMembership = await Membership.findOne({
          where: {
            gymId: booking.gymId,
            userId: booking.userId,
            isActive: true
          }
        });

        if (!existingMembership) {
          // Create a new membership based on the booking
          const membership = await Membership.create({
            name: `Membership - ${booking.gym.name || 'Gym'}`,
            description: `Membership created from confirmed booking on ${new Date(booking.bookingDate).toLocaleDateString()}`,
            price: booking.totalAmount,
            duration: 1,
            durationType: 'months',
            features: ['Access to gym facilities', 'Booking confirmation'],
            maxBookings: 10,
            isActive: true,
            isPopular: false,
            discountPercentage: 0,
            gymId: booking.gymId,
            userId: booking.userId
          });
        }
      } catch (membershipError) {
        console.error('Error creating membership for confirmed booking:', membershipError);
        // Don't fail the booking update if membership creation fails
      }
    }

    res.json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    console.error('Update booking status by owner error:', error);
    res.status(500).json({
      error: 'Failed to update booking status',
      details: error.message
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBooking,
  updateBookingStatus,
  updateBookingStatusByOwner,
  cancelBooking
}; 