import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TestUser, createTestUser, createTestAdmin } from '../utils/testHelpers';

// Mock the actual authService dependencies
jest.mock('../../src/models', () => ({
  User: require('../utils/testHelpers').TestUser,
}));

// Import after mocking
import authService from '../../src/services/authService';

describe('AuthService', () => {
  beforeEach(async () => {
    await TestUser.sync({ force: true });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const user = await createTestUser({
        username: 'testuser',
        password: 'password123',
      });

      // Act
      const result = await authService.login({
        username: 'testuser',
        password: 'password123',
      });

      // Assert
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.username).toBe('testuser');
      expect(result.user.id).toBe(user.id);
      expect(result.user.role).toBe('user');

      // Verify token is valid
      const decoded = jwt.verify(result.token, process.env.JWT_SECRET!) as any;
      expect(decoded.username).toBe('testuser');
    });

    it('should throw error for non-existent user', async () => {
      // Act & Assert
      await expect(
        authService.login({
          username: 'nonexistent',
          password: 'password123',
        })
      ).rejects.toThrow('Invalid username or password');
    });

    it('should throw error for invalid password', async () => {
      // Arrange
      await createTestUser({
        username: 'testuser',
        password: 'correctpassword',
      });

      // Act & Assert
      await expect(
        authService.login({
          username: 'testuser',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid username or password');
    });

    it('should handle admin user login', async () => {
      // Arrange
      const admin = await createTestAdmin({
        username: 'admin',
        password: 'admin123',
      });

      // Act
      const result = await authService.login({
        username: 'admin',
        password: 'admin123',
      });

      // Assert
      expect(result.user.role).toBe('admin');
      expect(result.user.username).toBe('admin');
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Act
      const result = await authService.register({
        username: 'newuser',
        password: 'password123',
      });

      // Assert
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.username).toBe('newuser');
      expect(result.user.role).toBe('user');

      // Verify user was created in database
      const user = await TestUser.findOne({ where: { username: 'newuser' } });
      expect(user).toBeTruthy();
      expect(user?.get('role')).toBe('user');

      // Verify password was hashed
      const isPasswordValid = await bcrypt.compare('password123', user?.get('password_hash') as string);
      expect(isPasswordValid).toBe(true);
    });

    it('should throw error for duplicate username', async () => {
      // Arrange
      await createTestUser({ username: 'existinguser' });

      // Act & Assert
      await expect(
        authService.register({
          username: 'existinguser',
          password: 'password123',
        })
      ).rejects.toThrow('Username already exists');
    });

    it('should throw error for password too short', async () => {
      // Act & Assert
      await expect(
        authService.register({
          username: 'newuser',
          password: '123', // Too short
        })
      ).rejects.toThrow('Password must be at least 6 characters long');
    });

    it('should generate valid JWT token on registration', async () => {
      // Act
      const result = await authService.register({
        username: 'newuser',
        password: 'password123',
      });

      // Assert
      const decoded = jwt.verify(result.token, process.env.JWT_SECRET!) as any;
      expect(decoded.username).toBe('newuser');
      expect(decoded.role).toBe('user');
      expect(decoded.id).toBeTruthy();
    });

    it('should hash password with bcrypt', async () => {
      // Act
      const result = await authService.register({
        username: 'newuser',
        password: 'password123',
      });

      // Assert
      const user = await TestUser.findByPk(result.user.id);
      const hashedPassword = user?.get('password_hash') as string;

      expect(hashedPassword).not.toBe('password123');
      expect(hashedPassword.startsWith('$2')).toBe(true); // bcrypt hash format ($2a$ or $2b$)

      const isValid = await bcrypt.compare('password123', hashedPassword);
      expect(isValid).toBe(true);
    });
  });

  describe('createAdmin', () => {
    it('should successfully create admin user', async () => {
      // Act
      await authService.createAdmin('adminuser', 'admin123');

      // Assert
      const admin = await TestUser.findOne({ where: { username: 'adminuser' } });
      expect(admin).toBeTruthy();
      expect(admin?.get('role')).toBe('admin');

      // Verify password was hashed
      const isPasswordValid = await bcrypt.compare('admin123', admin?.get('password_hash') as string);
      expect(isPasswordValid).toBe(true);
    });

    it('should create user with admin role', async () => {
      // Act
      await authService.createAdmin('superadmin', 'superpassword');

      // Assert
      const admin = await TestUser.findOne({ where: { username: 'superadmin' } });
      expect(admin?.get('role')).toBe('admin');
    });

    it('should hash admin password', async () => {
      // Act
      await authService.createAdmin('adminuser', 'plainpassword');

      // Assert
      const admin = await TestUser.findOne({ where: { username: 'adminuser' } });
      const hashedPassword = admin?.get('password_hash') as string;

      expect(hashedPassword).not.toBe('plainpassword');
      expect(await bcrypt.compare('plainpassword', hashedPassword)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty username', async () => {
      await expect(
        authService.login({ username: '', password: 'password123' })
      ).rejects.toThrow();
    });

    it('should handle empty password', async () => {
      await expect(
        authService.login({ username: 'testuser', password: '' })
      ).rejects.toThrow();
    });

    it('should handle null values gracefully', async () => {
      await expect(
        authService.login({ username: null as any, password: 'password123' })
      ).rejects.toThrow();
    });

    it('should handle very long passwords', async () => {
      const longPassword = 'a'.repeat(1000);

      const result = await authService.register({
        username: 'longpassuser',
        password: longPassword,
      });

      expect(result.user.username).toBe('longpassuser');

      // Verify login still works
      const loginResult = await authService.login({
        username: 'longpassuser',
        password: longPassword,
      });

      expect(loginResult.user.username).toBe('longpassuser');
    });

    it('should handle special characters in username', async () => {
      const specialUsername = 'user@test.com';

      const result = await authService.register({
        username: specialUsername,
        password: 'password123',
      });

      expect(result.user.username).toBe(specialUsername);
    });
  });
});