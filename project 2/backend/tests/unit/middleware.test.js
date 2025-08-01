const jwt = require('jsonwebtoken');
const { auth, requireAdmin, requireGymOwner } = require('../../src/middleware/auth');
const testData = require('../fixtures/testData');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  
  beforeEach(() => {
    mockReq = {
      headers: {},
      user: null,
      header: jest.fn()
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });
  
  describe('auth middleware', () => {
    it('should authenticate user with valid token', async () => {
      const user = testData.users.regular;
      const token = 'valid-token';
      
      mockReq.header.mockReturnValue(`Bearer ${token}`);
      jwt.verify.mockReturnValue({ id: user.id });
      
      const { User } = require('../../src/models');
      User.findByPk.mockResolvedValue(user);
      
      await auth(mockReq, mockRes, mockNext);
      
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(User.findByPk).toHaveBeenCalledWith(user.id);
      expect(mockReq.user).toEqual(user);
      expect(mockNext).toHaveBeenCalled();
    });
    
    it('should return 401 if no token provided', async () => {
      mockReq.header.mockReturnValue(undefined);
      
      await auth(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Access denied. No token provided.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should return 401 if token is invalid', async () => {
      mockReq.header.mockReturnValue('Bearer invalid-token');
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      await auth(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid token.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should return 401 if token format is invalid', async () => {
      mockReq.header.mockReturnValue('InvalidFormat token');
      
      await auth(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid token.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  
  describe('requireAdmin middleware', () => {
    it('should allow admin user', async () => {
      mockReq.user = testData.users.admin;
      
      await requireAdmin(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });
    
    it('should deny non-admin user', async () => {
      mockReq.user = testData.users.regular;
      
      await requireAdmin(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Admin access required.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should deny gym owner', async () => {
      mockReq.user = testData.users.gymOwner;
      
      await requireAdmin(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Admin access required.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  
  describe('requireGymOwner middleware', () => {
    it('should allow gym owner', async () => {
      mockReq.user = testData.users.gymOwner;
      
      await requireGymOwner(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });
    
    it('should deny regular user', async () => {
      mockReq.user = testData.users.regular;
      
      await requireGymOwner(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Gym owner access required.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should allow admin user', async () => {
      mockReq.user = testData.users.admin;
      
      await requireGymOwner(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
    });
  });
}); 