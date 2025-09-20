import sequelize from '../config/database';
import User from './User';
import Vehicle from './Vehicle';

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync models (create tables)
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
};

export { User, Vehicle, initializeDatabase };
export default sequelize;