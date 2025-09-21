import { Request, Response, NextFunction } from "express";
import aiService from "../services/aiService";
import { Vehicle } from "../models";

export const generateDescription =  async (req: Request, res: Response) => {
    try {
        const vehicleData = req.body;

        // validate required fields
        const requiredFields = ['type', 'brand', 'model', 'year', 'color', 'engine_size', 'price'];
        for (const field of requiredFields) {
            if (!vehicleData[field]) {
                return res.status(400).json({ 
                    success: false,
                    error: `${field} is required`,
                });
            }
        }

        const description = await aiService.generateDescription(vehicleData);

        res.json({
            success: true,
            data: { description },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate descriptionn',
        });
    }
};

export const regenerateDescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found',
      });
    }

    const vehicleData = {
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      engine_size: vehicle.engine_size,
      price: vehicle.price,
    };

    const description = await aiService.generateDescription(vehicleData);

    // Update vehicle with new AI description
    await vehicle.update({ ai_description: description });

    res.json({
      success: true,
      data: { description },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to regenerate description',
    });
  }
};