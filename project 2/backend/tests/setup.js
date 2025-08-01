// Test setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '24h';
process.env.DB_NAME = 'bayambook_test';
process.env.PORT = 8001;

// Mock sequelize to prevent database connection
jest.mock('../src/config/database', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true),
    query: jest.fn().mockResolvedValue([[{ result: 1 }], {}])
  }
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token'),
  verify: jest.fn().mockReturnValue({ id: 'test-user-id' })
}));

// Mock multer
jest.mock('multer', () => {
  const multer = () => {
    const upload = (req, res, next) => {
      // For testing, we need to simulate how multer processes form data
      // The form fields should be available in req.body after multer processes them
      // Since we're mocking multer, we need to ensure the form fields are preserved
      if (!req.body) req.body = {};
      
      // In a real multer scenario, the form fields would be parsed and available in req.body
      // For our test, we'll assume the fields are already there from supertest
      req.files = [{ filename: 'test-image.jpg' }];
      next();
    };
    upload.single = () => upload;
    upload.array = () => upload;
    upload.fields = () => upload;
    return upload;
  };
  
  multer.diskStorage = jest.fn().mockReturnValue({
    _handleFile: jest.fn(),
    _removeFile: jest.fn()
  });
  
  multer.memoryStorage = jest.fn().mockReturnValue({
    _handleFile: jest.fn(),
    _removeFile: jest.fn()
  });
  
  return multer;
});

// Mock the models - this needs to be done before any controllers are loaded
jest.mock('../src/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  Gym: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAndCountAll: jest.fn()
  },
  Booking: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAndCountAll: jest.fn()
  },
  Membership: {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn()
  }
}));

// Global test utilities
global.testUtils = {
  generateToken: (payload) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  },
  
  createTestUser: (role = 'user') => ({
    id: 'test-user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: role,
    isActive: true
  }),
  
  createTestGym: () => ({
    id: 'test-gym-id',
    name: 'Test Gym',
    description: 'Test gym description',
    address: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    phone: '1234567890',
    monthlyPrice: 2000,
    annualPrice: 20000,
    facilities: ['Parking', 'Shower'],
    images: ['/uploads/test-image.jpg']
  }),
  
  createTestBooking: () => ({
    id: 'test-booking-id',
    userId: 'test-user-id',
    gymId: 'test-gym-id',
    bookingDate: '2024-01-15',
    startTime: '10:00',
    endTime: '11:00',
    status: 'pending',
    totalAmount: 2000,
    paymentMethod: 'cash'
  })
}; 