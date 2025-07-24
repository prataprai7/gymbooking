const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Membership = sequelize.define('Membership', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('monthly', 'yearly'),
      allowNull: false,
      defaultValue: 'monthly'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'cancelled', 'pending'),
      defaultValue: 'pending'
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING
    },
    transactionId: {
      type: DataTypes.STRING
    },
    notes: {
      type: DataTypes.TEXT
    },
    autoRenew: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    discountCode: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['status']
      },
      {
        fields: ['startDate', 'endDate']
      },
      {
        fields: ['paymentStatus']
      }
    ]
  });

  return Membership;
};