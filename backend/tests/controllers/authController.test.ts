import { mockRequest, mockResponse, mockNext, createTestUser } from '../utils/testHelpers';

// Mock the authService
const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
  createAdmin: jest.fn(),
};

jest.mock('../../src/services/authService', () => ({
  __esModule: true,
  default: mockAuthService,
}));

// Import after mocking
import { login, register, createInitialAdmin } from '../../src/controllers/authController';

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const req = mockRequest({
        body: {
          username: 'testuser',
          password: 'password123',
        },
      });
      const res = mockResponse();
      const mockResult = {
        token: 'mock-jwt-token',
        user: { id: 1, username: 'testuser', role: 'user' },
      };

      mockAuthService.login.mockResolvedValue(mockResult);

      // Act
      await login(req, res);

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
      });
      expect(res.status).not.toHaveBeenCalled(); // Should use default 200
    });

    it('should return 400 for missing username', async () => {
      // Arrange
      const req = mockRequest({
        body: { password: 'password123' },
      });
      const res = mockResponse();

      // Act
      await login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Username and password required',
      });
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should return 400 for missing password', async () => {
      // Arrange
      const req = mockRequest({
        body: { username: 'testuser' },
      });
      const res = mockResponse();

      // Act
      await login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Username and password required',
      });
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid credentials', async () => {
      // Arrange
      const req = mockRequest({
        body: {
          username: 'testuser',
          password: 'wrongpassword',
        },
      });
      const res = mockResponse();

      mockAuthService.login.mockRejectedValue(new Error('Invalid username or password'));

      // Act
      await login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid username or password',
      });
    });

    it('should handle empty string values', async () => {
      // Arrange
      const req = mockRequest({
        body: {
          username: '',
          password: '',
        },
      });
      const res = mockResponse();

      // Act
      await login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Username and password required',
      });
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Arrange
      const req = mockRequest({
        body: {
          username: 'newuser',
          password: 'password123',
        },
      });
      const res = mockResponse();
      const mockResult = {
        token: 'mock-jwt-token',
        user: { id: 1, username: 'newuser', role: 'user' },
      };

      mockAuthService.register.mockResolvedValue(mockResult);

      // Act
      await register(req, res);

      // Assert
      expect(mockAuthService.register).toHaveBeenCalledWith({
        username: 'newuser',
        password: 'password123',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
      });
    });

    it('should return 400 for missing username', async () => {
      // Arrange
      const req = mockRequest({
        body: { password: 'password123' },
      });
      const res = mockResponse();

      // Act
      await register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Username and password required',
      });
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });

    it('should return 400 for missing password', async () => {
      // Arrange
      const req = mockRequest({
        body: { username: 'newuser' },
      });
      const res = mockResponse();

      // Act
      await register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Username and password required',
      });
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });

    it('should return 400 for duplicate username', async () => {
      // Arrange
      const req = mockRequest({
        body: {
          username: 'existinguser',
          password: 'password123',
        },
      });
      const res = mockResponse();

      mockAuthService.register.mockRejectedValue(new Error('Username already exists'));

      // Act
      await register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Username already exists',
      });
    });

    it('should return 400 for password too short', async () => {
      // Arrange
      const req = mockRequest({
        body: {
          username: 'newuser',
          password: '123',
        },
      });
      const res = mockResponse();

      mockAuthService.register.mockRejectedValue(new Error('Password must be at least 6 characters long'));

      // Act
      await register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Password must be at least 6 characters long',
      });
    });

    it('should handle unknown registration errors', async () => {
      // Arrange
      const req = mockRequest({
        body: {
          username: 'newuser',
          password: 'password123',
        },
      });
      const res = mockResponse();

      mockAuthService.register.mockRejectedValue(new Error('Database connection failed'));

      // Act
      await register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Database connection failed',
      });
    });
  });

  describe('createInitialAdmin', () => {
    it('should successfully create admin user', async () => {
      // Arrange
      const req = mockRequest({
        body: {
          username: 'admin',
          password: 'admin123',
        },
      });
      const res = mockResponse();

      mockAuthService.createAdmin.mockResolvedValue(undefined);

      // Act
      await createInitialAdmin(req, res);

      // Assert
      expect(mockAuthService.createAdmin).toHaveBeenCalledWith('admin', 'admin123');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Admin user created successfully',
      });
    });

    it('should return 400 for missing username', async () => {
      // Arrange
      const req = mockRequest({
        body: { password: 'admin123' },
      });
      const res = mockResponse();

      // Act
      await createInitialAdmin(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Username and password required',
      });
      expect(mockAuthService.createAdmin).not.toHaveBeenCalled();
    });

    it('should return 400 for missing password', async () => {
      // Arrange
      const req = mockRequest({
        body: { username: 'admin' },
      });
      const res = mockResponse();

      // Act
      await createInitialAdmin(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Username and password required',
      });
      expect(mockAuthService.createAdmin).not.toHaveBeenCalled();
    });

    it('should return 500 for admin creation failure', async () => {
      // Arrange
      const req = mockRequest({
        body: {
          username: 'admin',
          password: 'admin123',
        },
      });
      const res = mockResponse();

      mockAuthService.createAdmin.mockRejectedValue(new Error('Database error'));

      // Act
      await createInitialAdmin(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Database error',
      });
    });

    it('should handle non-Error exceptions', async () => {
      // Arrange
      const req = mockRequest({
        body: {
          username: 'admin',
          password: 'admin123',
        },
      });
      const res = mockResponse();

      mockAuthService.createAdmin.mockRejectedValue('String error');

      // Act
      await createInitialAdmin(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to create admin',
      });
    });
  });

  describe('error handling', () => {
    it('should handle malformed request body', async () => {
      // Arrange
      const req = mockRequest({
        body: null,
      });
      const res = mockResponse();

      // Act
      await login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401); // Service throws error
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.any(String),
      }));
    });

    it('should handle undefined request body', async () => {
      // Arrange
      const req = mockRequest({
        body: undefined,
      });
      const res = mockResponse();

      // Act
      await register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400); // Error in destructuring
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: expect.stringContaining('Cannot destructure'),
      }));
    });
  });
});