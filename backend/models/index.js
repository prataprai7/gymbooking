const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config);

// Import models
const User = require('./User')(sequelize);
const Gym = require('./Gym')(sequelize);
const Membership = require('./Membership')(sequelize);
const Review = require('./Review')(sequelize);

// Define associations
User.hasMany(Gym, { foreignKey: 'ownerId', as: 'ownedGyms' });
Gym.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Membership, { foreignKey: 'userId', as: 'memberships' });
Membership.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Gym.hasMany(Membership, { foreignKey: 'gymId', as: 'memberships' });
Membership.belongsTo(Gym, { foreignKey: 'gymId', as: 'gym' });

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Gym.hasMany(Review, { foreignKey: 'gymId', as: 'reviews' });
Review.belongsTo(Gym, { foreignKey: 'gymId', as: 'gym' });

module.exports = {
  sequelize,
  User,
  Gym,
  Membership,
  Review
};