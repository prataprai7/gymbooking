const request = require('supertest');
const { Gym, User } = require('../../src/models');
const testData = require('../fixtures/testData');

describe('Gym Controller', () => {
  let app;
  let authToken;
  
  beforeAll(async () => {
    app = require('../testServer');
    authToken = testUtils.generateToken(testData.users.gymOwner);
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock User.findByPk for authentication
    User.findByPk.mockResolvedValue(testData.users.gymOwner);
    
    // Mock jwt.verify to return the correct user ID
    const jwt = require('jsonwebtoken');
    jwt.verify.mockReturnValue({ id: testData.users.gymOwner.id });
  });
  
  describe('GET /api/gyms', () => {
    it('should get all gyms successfully', async () => {
      const gyms = [testData.gyms.basic, testData.gyms.premium];
      
      Gym.findAndCountAll.mockResolvedValue({
        rows: gyms,
        count: gyms.length
      });
      
      const response = await request(app)
        .get('/api/gyms')
        .query({ page: 1, limit: 10 });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('gyms');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.gyms).toHaveLength(2);
      expect(Gym.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.any(Array),
          order: expect.any(Array),
          limit: 10,
          offset: 0
        })
      );
    });
    
    it('should filter gyms by city', async () => {
      const filteredGyms = [testData.gyms.basic];
      
      Gym.findAndCountAll.mockResolvedValue({
        rows: filteredGyms,
        count: filteredGyms.length
      });
      
      const response = await request(app)
        .get('/api/gyms')
        .query({ city: 'Test City' });
      
      expect(response.status).toBe(200);
      expect(response.body.gyms).toHaveLength(1);
    });
  });
  
  describe('GET /api/gyms/:id', () => {
    it('should get gym by id successfully', async () => {
      const gym = testData.gyms.basic;
      
      Gym.findByPk.mockResolvedValue(gym);
      
      const response = await request(app)
        .get(`/api/gyms/${gym.id}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('gym');
      expect(response.body.gym.id).toBe(gym.id);
      expect(Gym.findByPk).toHaveBeenCalledWith(gym.id, {
        include: expect.any(Array),
        attributes: expect.any(Object)
      });
    });
    
    it('should return 404 if gym not found', async () => {
      Gym.findByPk.mockResolvedValue(null);
      
      const response = await request(app)
        .get('/api/gyms/nonexistent-id');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Gym not found');
    });
  });
  
  describe('POST /api/gyms', () => {
    it('should create gym successfully for gym owner', async () => {
      const gymData = testData.gyms.basic;
      const owner = testData.users.gymOwner;
      
      User.findByPk.mockResolvedValue(owner);
      Gym.create.mockResolvedValue({
        id: gymData.id,
        ...gymData
      });
      
      const response = await request(app)
        .post('/api/test/gyms')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: gymData.name,
          description: gymData.description,
          address: gymData.address,
          city: gymData.city,
          state: gymData.state,
          phone: gymData.phone,
          monthlyPrice: gymData.monthlyPrice,
          annualPrice: gymData.annualPrice,
          facilities: gymData.facilities
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Gym created successfully');
      expect(response.body).toHaveProperty('gym');
      expect(Gym.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: gymData.name,
          description: gymData.description,
          address: gymData.address,
          city: gymData.city,
          state: gymData.state,
          phone: gymData.phone,
          monthlyPrice: gymData.monthlyPrice,
          annualPrice: gymData.annualPrice,
          facilities: gymData.facilities,
          ownerId: owner.id
        })
      );
    });
    
    it('should return 403 for non-gym owner', async () => {
      const regularUserToken = testUtils.generateToken(testData.users.regular);
      User.findByPk.mockResolvedValue(testData.users.regular);
      
      // Mock jwt.verify to return the regular user ID
      const jwt = require('jsonwebtoken');
      jwt.verify.mockReturnValue({ id: testData.users.regular.id });
      
      const response = await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .field('name', 'Test Gym')
        .field('description', 'Test description')
        .field('address', '123 Test St')
        .field('city', 'Test City')
        .field('state', 'Test State')
        .field('phone', '1234567890');
      
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Gym owner access required.');
    });
    
    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${authToken}`)
        .field('name', '')
        .field('description', '')
        .field('address', '')
        .field('city', '')
        .field('state', '')
        .field('phone', '');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('GET /api/gyms/owner/bookings', () => {
    it('should get owner bookings successfully', async () => {
      const bookings = [testData.bookings.pending, testData.bookings.confirmed];
      
      // Mock the gyms owned by the user
      Gym.findAll.mockResolvedValue([
        { id: 'gym-1', name: 'Test Gym' }
      ]);
      
      // Mock the bookings query
      const { Booking } = require('../../src/models');
      Booking.findAndCountAll.mockResolvedValue({
        rows: bookings,
        count: bookings.length
      });
      
      const response = await request(app)
        .get('/api/gyms/owner/bookings')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('bookings');
    });
  });
}); 