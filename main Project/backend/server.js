const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const net = require('net');
require('dotenv').config();

const { sequelize } = require('./src/config/database');

require('./src/models');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const gymRoutes = require('./src/routes/gyms');
const membershipRoutes = require('./src/routes/memberships');
const bookingRoutes = require('./src/routes/bookings');
const adminRoutes = require('./src/routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(helmet());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use(limiter);


app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3004', 'http://localhost:5173'],
  credentials: true
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
   
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
   
    if (path.endsWith('.avif')) {
      res.setHeader('Content-Type', 'image/avif');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (path.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gyms', gymRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'BayamBook Gym Booking API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Check if port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close();
      resolve(true);
    });
    server.on('error', () => {
      resolve(false);
    });
  });
};

// Database connection and server start
const startServer = async () => {
  try {
    // Check if port is available
    const portAvailable = await isPortAvailable(PORT);
    if (!portAvailable) {
      console.error(`Port ${PORT} is already in use. Please stop any existing server processes.`);
      process.exit(1);
    }

    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database (in development) - skip sync to avoid constraint issues
    if (process.env.NODE_ENV === 'development') {
      try {
        // Only sync if tables don't exist, otherwise skip
        const tableExists = await sequelize.query(
          "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'User')",
          { type: sequelize.QueryTypes.SELECT }
        );
        
        if (!tableExists[0].exists) {
          await sequelize.sync({ force: false });
          console.log('Database synced successfully.');
        } else {
          console.log('Database tables already exist, skipping sync.');
        }
      } catch (syncError) {
        console.warn('Database sync warning (continuing):', syncError.message);
      }
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer(); 