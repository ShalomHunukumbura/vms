import { Request, Response } from 'express';
import vehicleService from '../services/vehicleService';
import { upload, deleteFile } from '../services/fileService';

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const params = {
      type: req.query.type as string,
      brand: req.query.brand as string,
      model: req.query.model as string,
      color: req.query.color as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      minYear: req.query.minYear ? Number(req.query.minYear) : undefined,
      maxYear: req.query.maxYear ? Number(req.query.maxYear) : undefined,
      search: req.query.search as string,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'ASC' | 'DESC',
    };

    const result = await vehicleService.getVehicles(params);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch vehicles',
    });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.getVehicleById(id);

    res.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Vehicle not found') {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch vehicle',
    });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleData = req.body;

    // Add uploaded images to vehicle data
    if (req.files && Array.isArray(req.files)) {
      vehicleData.images = req.files.map((file: any) => file.filename);
    }

    const vehicle = await vehicleService.createVehicle(vehicleData);

    res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create vehicle',
    });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle new uploaded images
    if (req.files && Array.isArray(req.files)) {
      updateData.images = req.files.map((file: any) => file.filename);
    }

    const vehicle = await vehicleService.updateVehicle(id, updateData);

    res.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Vehicle not found') {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update vehicle',
    });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get vehicle to delete associated images
    const vehicle = await vehicleService.getVehicleById(id);

    // Delete associated image files
    if (vehicle.images && Array.isArray(vehicle.images)) {
      vehicle.images.forEach((filename: string) => {
        deleteFile(filename);
      });
    }

    const result = await vehicleService.deleteVehicle(id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Vehicle not found') {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete vehicle',
    });
  }
};

export const uploadImages = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No images uploaded',
      });
    }

    const filenames = req.files.map((file: any) => file.filename);

    res.json({
      success: true,
      data: { filenames },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload images',
    });
  }
};