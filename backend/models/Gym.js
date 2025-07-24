const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Gym = sequelize.define('Gym', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    website: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    facilities: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    openingHours: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    monthlyPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    yearlyPrice: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 0
      }
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isBoosted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    boostExpiresAt: {
      type: DataTypes.DATE
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8)
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8)
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 50
    },
    establishedYear: {
      type: DataTypes.INTEGER
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['city']
      },
      {
        fields: ['district']
      },
      {
        fields: ['rating']
      },
      {
        fields: ['monthlyPrice']
      },
      {
        fields: ['isBoosted']
      }
    ]
  });

  return Gym;
};