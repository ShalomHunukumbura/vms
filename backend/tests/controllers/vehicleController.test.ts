import { Request, Response } from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadImages,
} from '../../src/controllers/vehicleController';

// Import services
import vehicleService from '../../src/services/vehicleService';
import * as fileService from '../../src/services/fileService';
import  Vehicle from '../../src/models/Vehicle';

// Mock services
jest.mock('../../src/services/vehicleService', () => ({
  getVehicles: jest.fn(),
  getVehicleById: jest.fn(),
  createVehicle: jest.fn(),
  updateVehicle: jest.fn(),
  deleteVehicle: jest.fn(),
}));

jest.mock('../../src/services/fileService', () => ({
  deleteFile: jest.fn(),
}));

// Cast services to mocked versions for type safety
const mockedVehicleService = vehicleService as jest.Mocked<typeof vehicleService>;
const mockedFileService = fileService as jest.Mocked<typeof fileService>;

// Mocked Response helper
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Vehicle Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getVehicles', () => {
    it('should return vehicles successfully', async () => {
      const req = { query: { page: '1', limit: '10' } } as unknown as Request;
      const res = mockResponse();

      mockedVehicleService.getVehicles.mockResolvedValue({
        items: [{ id: 1, brand: 'Toyota' } as unknown as Vehicle],
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
        limit: 10,
      });

      await getVehicles(req, res);

      expect(mockedVehicleService.getVehicles).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          items: [{ id: 1, brand: 'Toyota' }],
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          limit: 10,
        },
      });
    });

    it('should handle errors', async () => {
      const req = { query: {} } as unknown as Request;
      const res = mockResponse();

      mockedVehicleService.getVehicles.mockRejectedValue(new Error('DB error'));

      await getVehicles(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'DB error',
      });
    });
  });

  describe('getVehicleById', () => {
    it('should return vehicle by id', async () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();

      mockedVehicleService.getVehicleById.mockResolvedValue(
        { id: 1, brand: 'Honda' } as unknown as Vehicle
      );

      await getVehicleById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 1, brand: 'Honda' },
      });
    });

    it('should return 404 if not found', async () => {
      const req = { params: { id: '99' } } as unknown as Request;
      const res = mockResponse();

      mockedVehicleService.getVehicleById.mockRejectedValue(new Error('Vehicle not found'));

      await getVehicleById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Vehicle not found',
      });
    });
  });

  describe('createVehicle', () => {
    it('should create vehicle with images', async () => {
      const req = {
        body: { brand: 'Tesla' },
        files: [{ filename: 'img1.png' }, { filename: 'img2.png' }],
      } as unknown as Request;
      const res = mockResponse();

      mockedVehicleService.createVehicle.mockResolvedValue(
        { id: 1, brand: 'Tesla', images: ['img1.png', 'img2.png'] } as unknown as Vehicle
      );

      await createVehicle(req, res);

      expect(mockedVehicleService.createVehicle).toHaveBeenCalledWith({
        brand: 'Tesla',
        images: ['img1.png', 'img2.png'],
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateVehicle', () => {
    it('should update vehicle successfully', async () => {
      const req = {
        params: { id: '1' },
        body: { color: 'Red' },
      } as unknown as Request;
      const res = mockResponse();

      mockedVehicleService.updateVehicle.mockResolvedValue(
        { id: 1, color: 'Red' } as unknown as Vehicle
      );

      await updateVehicle(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 1, color: 'Red' },
      });
    });
  });

  describe('deleteVehicle', () => {
  it('should delete vehicle and associated images', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockResponse();

    mockedVehicleService.getVehicleById.mockResolvedValue(
      { id: 1, images: ['img1.png'] } as unknown as Vehicle
    );
    mockedVehicleService.deleteVehicle.mockResolvedValue({ message: 'Vehicle deleted' });

    await deleteVehicle(req, res);

    expect(mockedFileService.deleteFile).toHaveBeenCalledWith('img1.png');
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { message: 'Vehicle deleted' },
    });
  });
});

  describe('uploadImages', () => {
    it('should return filenames', async () => {
      const req = {
        files: [{ filename: 'a.png' }, { filename: 'b.png' }],
      } as unknown as Request;
      const res = mockResponse();

      await uploadImages(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { filenames: ['a.png', 'b.png'] },
      });
    });

    it('should return 400 if no files', async () => {
      const req = { files: [] } as unknown as Request;
      const res = mockResponse();

      await uploadImages(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'No images uploaded',
      });
    });
  });
});
