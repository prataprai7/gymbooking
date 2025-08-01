const request = require('supertest');
const { Booking, Gym, User, Membership } = require('../../src/models');
const testData = require('../fixtures/testData');

describe('Booking Controller', () => {
  let app;
  let userToken;
  let ownerToken;
  
  beforeAll(async () => {
    app = require('../testServer');
    userToken = testUtils.generateToken(testData.users.regular);
    ownerToken = testUtils.generateToken(testData.users.gymOwner);
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock User.findByPk for authentication
    User.findByPk.mockResolvedValue(testData.users.regular);
    // Mock jwt.verify to return the correct user ID
    const jwt = require('jsonwebtoken');
    jwt.verify.mockReturnValue({ id: testData.users.regular.id });
  });
  
  describe('POST /api/bookings', () => {
    it('should create booking successfully', async () => {
      const bookingData = testData.bookings.pending;
      const gym = testData.gyms.basic;
      const user = testData.users.regular;
      
      Gym.findByPk.mockResolvedValue(gym);
      User.findByPk.mockResolvedValue(user);
      Booking.create.mockResolvedValue({
        id: bookingData.id,
        ...bookingData
      });
      Booking.findByPk.mockResolvedValue({
        id: bookingData.id,
        ...bookingData,
        gym: gym,
        membership: null
      });
      
      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          gymId: bookingData.gymId,
          bookingDate: bookingData.bookingDate,
          startTime: bookingData.bookingTime,
          endTime: '11:00',
          totalAmount: bookingData.totalAmount,
          paymentMethod: bookingData.paymentMethod,
          notes: bookingData.notes
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Booking created successfully');
      expect(response.body).toHaveProperty('booking');
      expect(Booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: user.id,
          gymId: bookingData.gymId,
          bookingDate: bookingData.bookingDate,
          startTime: bookingData.bookingTime,
          endTime: '11:00',
          totalAmount: bookingData.totalAmount,
          paymentMethod: bookingData.paymentMethod,
          notes: bookingData.notes,
          status: 'pending'
        })
      );
    });
    
    it('should return 404 if gym not found', async () => {
      Gym.findByPk.mockResolvedValue(null);
      
      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          gymId: 'nonexistent-gym',
          bookingDate: '2024-01-15',
          startTime: '10:00',
          endTime: '11:00',
          totalAmount: 2000,
          paymentMethod: 'cash'
        });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Gym not found');
    });
    
    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          gymId: '',
          bookingDate: '',
          startTime: '',
          endTime: '',
          totalAmount: 0,
          paymentMethod: ''
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('GET /api/bookings', () => {
    it('should get user bookings successfully', async () => {
      const bookings = [testData.bookings.pending, testData.bookings.confirmed];
      
      Booking.findAndCountAll.mockResolvedValue({
        rows: bookings,
        count: bookings.length
      });
      
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('bookings');
      expect(response.body.bookings).toHaveLength(2);
      expect(Booking.findAndCountAll).toHaveBeenCalledWith({
        where: { userId: testData.users.regular.id },
        include: expect.any(Array),
        order: expect.any(Array),
        limit: 10,
        offset: 0
      });
    });
  });
  
  describe('GET /api/bookings/:id', () => {
    it('should get booking by id successfully', async () => {
      const booking = testData.bookings.pending;
      
      Booking.findOne.mockResolvedValue(booking);
      
      const response = await request(app)
        .get(`/api/bookings/${booking.id}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('booking');
      expect(response.body.booking.id).toBe(booking.id);
    });
    
    it('should return 404 if booking not found', async () => {
      Booking.findOne.mockResolvedValue(null);
      
      const response = await request(app)
        .get('/api/bookings/nonexistent-id')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Booking not found');
    });
  });
  
  describe('PUT /api/bookings/:id/status', () => {
    it('should update booking status successfully', async () => {
      const booking = testData.bookings.pending;
      
      // Mock the booking instance with update method
      const mockBooking = {
        ...booking,
        update: jest.fn().mockResolvedValue(booking)
      };
      Booking.findOne.mockResolvedValue(mockBooking);
      
      const response = await request(app)
        .put(`/api/bookings/${booking.id}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'cancelled' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Booking updated successfully');
      expect(mockBooking.update).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'cancelled' })
      );
    });
    
    it('should return 404 if booking not found', async () => {
      Booking.findOne.mockResolvedValue(null);
      
      const response = await request(app)
        .put('/api/bookings/nonexistent-id/status')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'cancelled' });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Booking not found');
    });
  });
  
  describe('PUT /api/bookings/:id/status/owner', () => {
    it('should update booking status by owner successfully', async () => {
      const booking = testData.bookings.pending;
      const gym = testData.gyms.basic;
      
      // Mock gym owner authentication
      User.findByPk.mockResolvedValue(testData.users.gymOwner);
      
      // Mock the booking with gym data
      const mockBooking = {
        ...booking,
        gym: { ...gym, ownerId: testData.users.gymOwner.id },
        update: jest.fn().mockResolvedValue(booking)
      };
      Booking.findOne.mockResolvedValue(mockBooking);
      
      const response = await request(app)
        .put(`/api/bookings/${booking.id}/status/owner`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ status: 'confirmed' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Booking status updated successfully');
      expect(mockBooking.update).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'confirmed' })
      );
    });
    
    it('should create membership when booking is confirmed', async () => {
      const booking = testData.bookings.pending;
      const gym = testData.gyms.basic;
      
      // Mock gym owner authentication
      User.findByPk.mockResolvedValue(testData.users.gymOwner);
      
      // Mock the booking with gym data
      const mockBooking = {
        ...booking,
        gym: { ...gym, ownerId: testData.users.gymOwner.id },
        update: jest.fn().mockResolvedValue(booking)
      };
      Booking.findOne.mockResolvedValue(mockBooking);
      Membership.findOne.mockResolvedValue(null); // No existing membership
      Membership.create.mockResolvedValue({
        id: 'membership-1',
        userId: booking.userId,
        gymId: booking.gymId,
        name: 'Monthly Plan',
        price: booking.totalAmount,
        duration: 1,
        durationType: 'months',
        isActive: true
      });
      
      const response = await request(app)
        .put(`/api/bookings/${booking.id}/status/owner`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ status: 'confirmed' });
      
      expect(response.status).toBe(200);
      expect(Membership.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: booking.userId,
          gymId: booking.gymId,
          price: booking.totalAmount
        })
      );
    });
    
    it('should return 403 if not gym owner', async () => {
      const booking = testData.bookings.pending;
      const gym = testData.gyms.basic;
      
      // Mock gym owner authentication (passes middleware)
      User.findByPk.mockResolvedValue(testData.users.gymOwner);
      
      // Mock the booking with gym data owned by someone else
      const mockBooking = {
        ...booking,
        gym: { ...gym, ownerId: 'different-owner-id' },
        update: jest.fn().mockResolvedValue(booking)
      };
      Booking.findOne.mockResolvedValue(mockBooking);
      
      const response = await request(app)
        .put(`/api/bookings/${booking.id}/status/owner`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ status: 'confirmed' });
      
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Not authorized to update this booking');
    });
  });
}); 