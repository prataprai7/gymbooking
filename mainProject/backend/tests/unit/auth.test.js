const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../src/models');
const testData = require('../fixtures/testData');

describe('Auth Controller', () => {
  let app;
  
  beforeAll(async () => {
    app = require('../testServer');
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = testData.users.regular;
      const hashedPassword = 'hashedPassword123';
      
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        id: userData.id,
        email: userData.email,
        username: userData.email.split('@')[0],
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        getPublicProfile: () => ({
          id: userData.id,
          email: userData.email,
          username: userData.email.split('@')[0],
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        })
      });
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: userData.email.split('@')[0],
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: userData.email,
          username: userData.email.split('@')[0],
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        })
      );
    });
    
    it('should return 400 if email already exists', async () => {
      const userData = testData.users.regular;
      
      User.findOne.mockResolvedValue({ id: 'existing-user' });
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: userData.email.split('@')[0],
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'User with this email or username already exists');
    });
    
    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: '',
          email: 'invalid-email',
          password: '123',
          firstName: '',
          lastName: ''
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const userData = testData.users.regular;
      const token = 'test-token';
      
      const mockUser = {
        id: userData.id,
        email: userData.email,
        password: 'hashedPassword123',
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        isActive: true,
        checkPassword: jest.fn().mockResolvedValue(true),
        update: jest.fn().mockResolvedValue(true),
        getPublicProfile: () => ({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        })
      };
      
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue(token);
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token', token);
      expect(response.body).toHaveProperty('user');
      expect(mockUser.checkPassword).toHaveBeenCalledWith(userData.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: userData.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
    });
    
    it('should return 401 for invalid credentials', async () => {
      const userData = testData.users.regular;
      
      const mockUser = {
        id: userData.id,
        email: userData.email,
        password: 'hashedPassword123',
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        isActive: true,
        checkPassword: jest.fn().mockResolvedValue(false)
      };
      
      User.findOne.mockResolvedValue(mockUser);
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });
    
    it('should return 404 if user not found', async () => {
      User.findOne.mockResolvedValue(null);
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });
  });
}); 