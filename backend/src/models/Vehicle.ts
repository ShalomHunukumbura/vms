import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface VehicleAttributes {
  id?: number;
  type: 'Car' | 'Bike' | 'SUV' | 'Truck' | 'Van';
  brand: string;
  model: string;
  color: string;
  engine_size: string;
  year: number;
  price: number;
  description?: string;
  ai_description?: string;
  images?: string[];
  created_at?: Date;
  updated_at?: Date;
}

class Vehicle extends Model<VehicleAttributes> implements VehicleAttributes {
  public id!: number;
  public type!: 'Car' | 'Bike' | 'SUV' | 'Truck' | 'Van';
  public brand!: string;
  public model!: string;
  public color!: string;
  public engine_size!: string;
  public year!: number;
  public price!: number;
  public description?: string;
  public ai_description?: string;
  public images?: string[];
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('Car', 'Bike', 'SUV', 'Truck', 'Van'),
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    engine_size: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
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
  },
  {
    sequelize,
    tableName: 'vehicles',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['type'] },
      { fields: ['brand'] },
      { fields: ['year'] },
      { fields: ['price'] },
    ],
  }
);

export default Vehicle;