import { Sequelize } from 'sequelize';

export const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

export const initializeTestDatabase = async () => {
  try {
    await testSequelize.authenticate();
    await testSequelize.sync({ force: true });
    console.log('Test database initialized');
  } catch (error) {
    console.error('Test database initialization failed:', error);
    throw error;
  }
};

export const cleanupTestDatabase = async () => {
  await testSequelize.close();
};