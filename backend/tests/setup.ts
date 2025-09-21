import { Sequelize } from 'sequelize';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

export const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

beforeAll(async () => {
  await testSequelize.sync({ force: true });
});

afterAll(async () => {
  await testSequelize.close();
});

beforeEach(async () => {
  await testSequelize.truncate({ cascade: true, restartIdentity: true });
});

global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};