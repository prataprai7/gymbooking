const User = require('./User');
const Gym = require('./Gym');
const Membership = require('./Membership');
const Booking = require('./Booking');


User.hasMany(Gym, { as: 'ownedGyms', foreignKey: 'ownerId' });
User.hasMany(Booking, { as: 'bookings', foreignKey: 'userId' });


Gym.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
Gym.hasMany(Membership, { as: 'memberships', foreignKey: 'gymId' });
Gym.hasMany(Booking, { as: 'bookings', foreignKey: 'gymId' });


Membership.belongsTo(Gym, { as: 'gym', foreignKey: 'gymId' });
Membership.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Membership.hasMany(Booking, { as: 'bookings', foreignKey: 'membershipId' });


Booking.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Booking.belongsTo(Gym, { as: 'gym', foreignKey: 'gymId' });
Booking.belongsTo(Membership, { as: 'membership', foreignKey: 'membershipId' });

module.exports = {
  User,
  Gym,
  Membership,
  Booking
}; 