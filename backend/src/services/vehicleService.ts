import { Op, fn, col } from 'sequelize';
import { Vehicle } from '../models';
import aiService from './aiService';

export interface VehicleCreateData {
  type: 'Car' | 'Bike' | 'SUV' | 'Truck' | 'Van';
  brand: string;
  model: string;
  color: string;
  engine_size: string;
  year: number;
  price: number;
  description?: string;
  images?: string[];
  ai_description?: string;
}

export interface VehicleSearchParams {
  type?: string;
  brand?: string;
  model?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

class VehicleService {
  async createVehicle(data: VehicleCreateData) {
    // Generate AI description
    const aiDescription = await aiService.generateDescription({
      type: data.type,
      brand: data.brand,
      model: data.model,
      year: data.year,
      color: data.color,
      engine_size: data.engine_size,
      price: data.price,
    });

    const vehicle = await Vehicle.create({
      ...data,
      ai_description: aiDescription,
    });

    return vehicle;
  }
	
  async getVehicles(params: VehicleSearchParams = {}) {
    const {
      type,
      brand,
      model,
      color,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      search,
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = params;

    const offset = (page - 1) * limit;
    const where: any = {};

    // Apply filters
    if (type) where.type = type;
    if (brand) where.brand = { [Op.like]: `%${brand}%` };
    if (model) where.model = { [Op.like]: `%${model}%` };
    if (color) where.color = { [Op.like]: `%${color}%` };

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    if (minYear || maxYear) {
      where.year = {};
      if (minYear) where.year[Op.gte] = minYear;
      if (maxYear) where.year[Op.lte] = maxYear;
    }

    // Global search
    if (search) {
      where[Op.or] = [
        { brand: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } },
        { color: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { ai_description: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows: vehicles } = await Vehicle.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      items: vehicles,
      currentPage: page,
      totalPages,
      totalItems: count,
      limit,
    };
  }

  async getVehicleById(id: string) {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return vehicle;
  }

  async updateVehicle(id: string, data: Partial<VehicleCreateData>) {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // If critical data changed, regenerate AI description
    const criticalFields = ['type', 'brand', 'model', 'year', 'color', 'engine_size', 'price'];
    const shouldRegenerateAI = criticalFields.some(field =>
      data[field as keyof VehicleCreateData] !== undefined &&
      data[field as keyof VehicleCreateData] !== vehicle[field as keyof Vehicle]
    );

    if (shouldRegenerateAI) {
      const updatedData = { ...vehicle.toJSON(), ...data };
      const aiDescription = await aiService.generateDescription({
        type: updatedData.type,
        brand: updatedData.brand,
        model: updatedData.model,
        year: updatedData.year,
        color: updatedData.color,
        engine_size: updatedData.engine_size,
        price: updatedData.price,
      });
      data.ai_description = aiDescription;
    }

    await vehicle.update(data);
    return vehicle;
  }

  async deleteVehicle(id: string) {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    await vehicle.destroy();
    return { message: 'Vehicle deleted successfully' };
  }
}

export default new VehicleService();