import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vehicleAPI, getImageUrl } from '../utils/api';
import type { Vehicle } from '../types';
import Layout from '../components/layout/Layout';
import { getErrorMessage } from '../types/api-error';

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError('');
        const vehicleData = await vehicleAPI.getVehicleById(id);
        setVehicle(vehicleData);
      } catch (err) {
        setError(getErrorMessage(err) || 'Failed to fetch vehicle details');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !vehicle) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error || 'Vehicle not found'}</div>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Vehicles
          </Link>
        </div>
      </Layout>
    );
  }

  const images = vehicle.images && vehicle.images.length > 0
    ? vehicle.images.map(filename => getImageUrl(filename))
    : ['/placeholder-car.jpg'];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Vehicles
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={images[selectedImageIndex]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-car.jpg';
                }}
              />
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-w-1 aspect-h-1 bg-gray-200 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-blue-500'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${vehicle.brand} ${vehicle.model} ${index + 1}`}
                      className="w-full h-20 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-car.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                {vehicle.type}
              </span>
              <h1 className="text-3xl font-bold text-white">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                ${vehicle.price.toLocaleString()}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Year</span>
                  <p className="text-lg text-gray-900">{vehicle.year}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Color</span>
                  <p className="text-lg text-gray-900">{vehicle.color}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Engine Size</span>
                  <p className="text-lg text-gray-900">{vehicle.engine_size}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Type</span>
                  <p className="text-lg text-gray-900">{vehicle.type}</p>
                </div>
              </div>
            </div>
            {/* AI Description */}
            {vehicle.ai_description && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  AI Generated Description
                </h3>
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {vehicle.ai_description}
                </p>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Interested in this vehicle?
              </h3>
              <p className="text-gray-700 mb-4">
                Contact us for more information or to schedule a test drive.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> +1 (555) 123-4567
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> info@vehiclems.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VehicleDetail;