import { DataTypes } from 'sequelize';
import { testSequelize } from '../../src/config/testDatabase';

// Test User Model
export const TestUser = testSequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
  },
}, {
  tableName: 'users',
  underscored: true,
  timestamps: true,
});

// Test Vehicle Model
export const TestVehicle = testSequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Car', 'Bike', 'SUV', 'Truck', 'Van'),
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  engine_size: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ai_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'vehicles',
  underscored: true,
  timestamps: true,
});