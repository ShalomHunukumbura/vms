import { TestVehicle, createTestVehicle } from '../utils/testHelpers';

// Mock the actual vehicleService dependencies
jest.mock('../../src/models', () => ({
  Vehicle: require('../utils/testHelpers').TestVehicle,
}));

// Import after mocking
import vehicleService from '../../src/services/vehicleService';

describe('VehicleService', () => {
  beforeEach(async () => {
    await TestVehicle.sync({ force: true });
  });

  describe('getVehicles', () => {
    it('should return paginated vehicles with default parameters', async () => {
      // Arrange
      await createTestVehicle({ brand: 'Toyota', model: 'Camry' });
      await createTestVehicle({ brand: 'Honda', model: 'Civic' });
      await createTestVehicle({ brand: 'Ford', model: 'Focus' });

      // Act
      const result = await vehicleService.getVehicles({});

      // Assert
      expect(result.items).toHaveLength(3);
      expect(result.currentPage).toBe(1);
      expect(result.totalItems).toBe(3);
      expect(result.totalPages).toBe(1);
      expect(result.limit).toBe(10); // default limit
    });

    it('should apply pagination correctly', async () => {
      // Arrange
      for (let i = 1; i <= 15; i++) {
        await createTestVehicle({ brand: `Brand${i}`, model: `Model${i}` });
      }

      // Act
      const result = await vehicleService.getVehicles({ page: 2, limit: 5 });

      // Assert
      expect(result.items).toHaveLength(5);
      expect(result.currentPage).toBe(2);
      expect(result.totalItems).toBe(15);
      expect(result.totalPages).toBe(3);
      expect(result.limit).toBe(5);
    });

    it('should filter by search term', async () => {
      // Arrange
      await createTestVehicle({ brand: 'Toyota', model: 'Camry' });
      await createTestVehicle({ brand: 'Honda', model: 'Civic' });
      await createTestVehicle({ brand: 'Toyota', model: 'Corolla' });

      // Act
      const result = await vehicleService.getVehicles({ search: 'Toyota' });

      // Assert
      expect(result.items).toHaveLength(2);
      expect(result.items[0].brand).toBe('Toyota');
      expect(result.items[1].brand).toBe('Toyota');
    });

    it('should filter by brand', async () => {
      // Arrange
      await createTestVehicle({ brand: 'Toyota', model: 'Camry' });
      await createTestVehicle({ brand: 'Honda', model: 'Civic' });
      await createTestVehicle({ brand: 'Toyota', model: 'Corolla' });

      // Act
      const result = await vehicleService.getVehicles({ brand: 'Honda' });

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].brand).toBe('Honda');
      expect(result.items[0].model).toBe('Civic');
    });

    it('should filter by vehicle type', async () => {
      // Arrange
      await createTestVehicle({ type: 'Car', brand: 'Toyota' });
      await createTestVehicle({ type: 'SUV', brand: 'Honda' });
      await createTestVehicle({ type: 'Car', brand: 'Ford' });

      // Act
      const result = await vehicleService.getVehicles({ type: 'SUV' });

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].type).toBe('SUV');
      expect(result.items[0].brand).toBe('Honda');
    });

    it('should filter by year range', async () => {
      // Arrange
      await createTestVehicle({ year: 2020, brand: 'Toyota' });
      await createTestVehicle({ year: 2022, brand: 'Honda' });
      await createTestVehicle({ year: 2024, brand: 'Ford' });

      // Act
      const result = await vehicleService.getVehicles({ minYear: 2021, maxYear: 2023 });

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].year).toBe(2022);
      expect(result.items[0].brand).toBe('Honda');
    });

    it('should filter by price range', async () => {
      // Arrange
      await createTestVehicle({ price: 20000, brand: 'Toyota' });
      await createTestVehicle({ price: 30000, brand: 'Honda' });
      await createTestVehicle({ price: 40000, brand: 'Ford' });

      // Act
      const result = await vehicleService.getVehicles({ minPrice: 25000, maxPrice: 35000 });

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].price).toBe(30000);
      expect(result.items[0].brand).toBe('Honda');
    });

    it('should sort by price ascending', async () => {
      // Arrange
      await createTestVehicle({ price: 30000, brand: 'Honda' });
      await createTestVehicle({ price: 20000, brand: 'Toyota' });
      await createTestVehicle({ price: 40000, brand: 'Ford' });

      // Act
      const result = await vehicleService.getVehicles({ sortBy: 'price', sortOrder: 'ASC' });

      // Assert
      expect(result.items).toHaveLength(3);
      expect(result.items[0].brand).toBe('Toyota'); // 20000
      expect(result.items[1].brand).toBe('Honda');  // 30000
      expect(result.items[2].brand).toBe('Ford');   // 40000
    });

    it('should sort by year descending', async () => {
      // Arrange
      await createTestVehicle({ year: 2020, brand: 'Toyota' });
      await createTestVehicle({ year: 2024, brand: 'Ford' });
      await createTestVehicle({ year: 2022, brand: 'Honda' });

      // Act
      const result = await vehicleService.getVehicles({ sortBy: 'year', sortOrder: 'DESC' });

      // Assert
      expect(result.items).toHaveLength(3);
      expect(result.items[0].brand).toBe('Ford');   // 2024
      expect(result.items[1].brand).toBe('Honda');  // 2022
      expect(result.items[2].brand).toBe('Toyota'); // 2020
    });

    it('should combine multiple filters', async () => {
      // Arrange
      await createTestVehicle({ brand: 'Toyota', type: 'Car', year: 2022, price: 25000 });
      await createTestVehicle({ brand: 'Toyota', type: 'SUV', year: 2022, price: 35000 });
      await createTestVehicle({ brand: 'Honda', type: 'Car', year: 2022, price: 28000 });

      // Act
      const result = await vehicleService.getVehicles({
        brand: 'Toyota',
        type: 'Car',
        minPrice: 20000,
        maxPrice: 30000,
      });

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].brand).toBe('Toyota');
      expect(result.items[0].type).toBe('Car');
      expect(result.items[0].price).toBe(25000);
    });

    it('should return empty result when no vehicles match filters', async () => {
      // Arrange
      await createTestVehicle({ brand: 'Toyota', year: 2020 });

      // Act
      const result = await vehicleService.getVehicles({ brand: 'Nonexistent' });

      // Assert
      expect(result.items).toHaveLength(0);
      expect(result.totalItems).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it('should handle empty database', async () => {
      // Act
      const result = await vehicleService.getVehicles({});

      // Assert
      expect(result.items).toHaveLength(0);
      expect(result.totalItems).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(result.currentPage).toBe(1);
    });
  });

  describe('getVehicleById', () => {
    it('should return vehicle by id', async () => {
      // Arrange
      const vehicle = await createTestVehicle({ brand: 'Toyota', model: 'Camry' });

      // Act
      const result = await vehicleService.getVehicleById(vehicle.id.toString());

      // Assert
      expect(result).toBeTruthy();
      expect(result.brand).toBe('Toyota');
      expect(result.model).toBe('Camry');
      expect(result.id).toBe(vehicle.id);
    });

    it('should throw error for non-existent vehicle', async () => {
      // Act & Assert
      await expect(vehicleService.getVehicleById('999')).rejects.toThrow('Vehicle not found');
    });

    it('should throw error for invalid id', async () => {
      // Act & Assert
      await expect(vehicleService.getVehicleById('-1')).rejects.toThrow('Vehicle not found');
    });
  });

  describe('createVehicle', () => {
    it('should create a new vehicle', async () => {
      // Arrange
      const vehicleData = {
        brand: 'BMW',
        model: 'X5',
        year: 2023,
        type: 'SUV' as const,
        color: 'Black',
        engine_size: '3.0L',
        price: 55000,
        description: 'Luxury SUV',
        ai_description: 'AI description for BMW X5',
        images: ['bmw-x5-1.jpg', 'bmw-x5-2.jpg'],
      };

      // Act
      const result = await vehicleService.createVehicle(vehicleData);

      // Assert
      expect(result).toBeTruthy();
      expect(result.brand).toBe('BMW');
      expect(result.model).toBe('X5');
      expect(result.year).toBe(2023);
      expect(result.type).toBe('SUV');
      expect(result.price).toBe(55000);

      // Verify it was saved to database
      const saved = await TestVehicle.findByPk(result.id);
      expect(saved).toBeTruthy();
    });

    it('should create vehicle with minimal required fields', async () => {
      // Arrange
      const vehicleData = {
        brand: 'Nissan',
        model: 'Altima',
        year: 2021,
        type: 'Car' as const,
        color: 'White',
        engine_size: '2.0L',
        price: 24000,
      };

      // Act
      const result = await vehicleService.createVehicle(vehicleData);

      // Assert
      expect(result).toBeTruthy();
      expect(result.brand).toBe('Nissan');
      expect(result.description).toBeUndefined();
      expect(result.ai_description).toBeTruthy(); // AI description should be generated
      expect(result.images).toBeUndefined();
    });

    it('should handle price as decimal correctly', async () => {
      // Arrange
      const vehicleData = {
        brand: 'Tesla',
        model: 'Model 3',
        year: 2023,
        type: 'Car' as const,
        color: 'Red',
        engine_size: 'Electric',
        price: 45999.99,
      };

      // Act
      const result = await vehicleService.createVehicle(vehicleData);

      // Assert
      expect(result.price).toBe(45999.99);
    });
  });

  describe('updateVehicle', () => {
    it('should update existing vehicle', async () => {
      // Arrange
      const vehicle = await createTestVehicle({ brand: 'Toyota', model: 'Camry', price: 25000 });
      const updateData = {
        brand: 'Toyota',
        model: 'Camry Hybrid',
        price: 28000,
      };

      // Act
      const result = await vehicleService.updateVehicle(vehicle.id.toString(), updateData);

      // Assert
      expect(result.model).toBe('Camry Hybrid');
      expect(result.price).toBe(28000);
      expect(result.brand).toBe('Toyota'); // unchanged
    });

    it('should update only provided fields', async () => {
      // Arrange
      const vehicle = await createTestVehicle({
        brand: 'Honda',
        model: 'Civic',
        year: 2020,
        color: 'Blue',
      });
      const updateData = { color: 'Red' };

      // Act
      const result = await vehicleService.updateVehicle(vehicle.id.toString(), updateData);

      // Assert
      expect(result.color).toBe('Red');
      expect(result.brand).toBe('Honda'); // unchanged
      expect(result.model).toBe('Civic'); // unchanged
      expect(result.year).toBe(2020); // unchanged
    });

    it('should throw error for non-existent vehicle', async () => {
      // Act & Assert
      await expect(
        vehicleService.updateVehicle('999', { brand: 'Test' })
      ).rejects.toThrow('Vehicle not found');
    });

    it('should update images array', async () => {
      // Arrange
      const vehicle = await createTestVehicle({
        images: ['old-image.jpg'],
      });
      const updateData = {
        images: ['new-image-1.jpg', 'new-image-2.jpg'],
      };

      // Act
      const result = await vehicleService.updateVehicle(vehicle.id.toString(), updateData);

      // Assert
      expect(result.images).toEqual(['new-image-1.jpg', 'new-image-2.jpg']);
    });
  });

  describe('deleteVehicle', () => {
    it('should delete existing vehicle', async () => {
      // Arrange
      const vehicle = await createTestVehicle({ brand: 'Toyota' });

      // Act
      await vehicleService.deleteVehicle(vehicle.id.toString());

      // Assert
      const deleted = await TestVehicle.findByPk(vehicle.id);
      expect(deleted).toBeNull();
    });

    it('should throw error for non-existent vehicle', async () => {
      // Act & Assert
      await expect(vehicleService.deleteVehicle('999')).rejects.toThrow('Vehicle not found');
    });

    it('should not affect other vehicles', async () => {
      // Arrange
      const vehicle1 = await createTestVehicle({ brand: 'Toyota' });
      const vehicle2 = await createTestVehicle({ brand: 'Honda' });

      // Act
      await vehicleService.deleteVehicle(vehicle1.id.toString());

      // Assert
      const remaining = await TestVehicle.findByPk(vehicle2.id);
      expect(remaining).toBeTruthy();
      expect(remaining?.get('brand')).toBe('Honda');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle invalid page numbers', async () => {
      // Arrange
      await createTestVehicle();

      // Act
      const result = await vehicleService.getVehicles({ page: -1 });

      // Assert
      expect(result.currentPage).toBe(-1); // Service returns what was passed
    });

    it('should handle zero limit', async () => {
      // Arrange
      await createTestVehicle();

      // Act
      const result = await vehicleService.getVehicles({ limit: 0 });

      // Assert
      expect(result.limit).toBe(0); // Service returns what was passed
    });

    it('should handle very large page numbers', async () => {
      // Arrange
      await createTestVehicle();

      // Act
      const result = await vehicleService.getVehicles({ page: 999 });

      // Assert
      expect(result.items).toHaveLength(0);
      expect(result.currentPage).toBe(999);
    });

    it('should handle invalid sort fields gracefully', async () => {
      // Arrange
      await createTestVehicle({ brand: 'Toyota' });

      // Act & Assert
      await expect(vehicleService.getVehicles({
        sortBy: 'invalid_field' as any,
        sortOrder: 'ASC',
      })).rejects.toThrow(); // Should throw an error for invalid field
    });

    it('should handle case-insensitive search', async () => {
      // Arrange
      await createTestVehicle({ brand: 'Toyota', model: 'Camry' });

      // Act
      const result = await vehicleService.getVehicles({ search: 'toyota' });

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].brand).toBe('Toyota');
    });
  });
});