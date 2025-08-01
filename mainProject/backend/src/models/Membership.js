const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Membership = sequelize.define('Membership', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in days'
  },
  durationType: {
    type: DataTypes.ENUM('days', 'weeks', 'months', 'years'),
    allowNull: false,
    defaultValue: 'months'
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of features included in this membership'
  },
  maxBookings: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum number of bookings allowed per month (null for unlimited)'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  gymId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Gym',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'User',
      key: 'id'
    },
    comment: 'User who has this membership (null for general gym memberships)'
  }
});

module.exports = Membership; 