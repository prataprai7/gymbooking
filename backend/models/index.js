const User = require('./User');
const Gym = require('./Gym');
const Booking = require('./Booking');

// Define associations
User.hasMany(Gym, { foreignKey: 'ownerId', as: 'ownedGyms' });
Gym.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Gym.hasMany(Booking, { foreignKey: 'gymId', as: 'bookings' });
Booking.belongsTo(Gym, { foreignKey: 'gymId', as: 'gym' });

// Self-referencing association for cancelled bookings
Booking.belongsTo(User, { foreignKey: 'cancelledBy', as: 'cancelledByUser' });

module.exports = {
  User,
  Gym,
  Booking
}; 