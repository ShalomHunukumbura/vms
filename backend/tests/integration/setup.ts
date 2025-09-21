import { initializeTestDatabase, cleanupTestDatabase, testSequelize } from '../../src/config/testDatabase';
import { TestUser, TestVehicle } from '../models/testModels';

jest.mock('../../src/config/database', () => require('../../src/config/testDatabase').testSequelize);

jest.mock('../../src/models/User', () => require('../models/testModels').TestUser);
jest.mock('../../src/models/Vehicle', () => require('../models/testModels').TestVehicle);

beforeAll(async () => {
  await initializeTestDatabase();
});

afterAll(async () => {
  await cleanupTestDatabase();
});

beforeEach(async () => {
  await testSequelize.sync({ force: true });
});

export { TestUser, TestVehicle };

export const clearDatabase = async () => {
  try {
    await testSequelize.sync({ force: true });
  } catch (error) {
    console.error('Database clear failed:', error);
    throw error;
  }
};

export const createTestUser = async (overrides: any = {}) => {
  const bcrypt = require('bcryptjs');
  const password = overrides.password || 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = {
    username: 'testuser',
    password_hash: hashedPassword,
    role: 'user',
    ...overrides,
  };
  delete userData.password;
  userData.password_hash = hashedPassword;

  const user = await TestUser.create(userData);
  return user.dataValues;
};