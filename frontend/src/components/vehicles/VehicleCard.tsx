import React from 'react';
import { Link } from 'react-router-dom';
import type { Vehicle } from '../../types';
import { getImageUrl } from '../../utils/api';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const primaryImage = vehicle.images && vehicle.images.length > 0
    ? getImageUrl(vehicle.images[0])
    : '/placeholder-car.jpg';

  return (
    <Link
      to={`/vehicle/${vehicle.id}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <div className="aspect-w-16 aspect-h-10 bg-gray-200">
        <img
          src={primaryImage}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-car.jpg';
          }}
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
            {vehicle.brand} {vehicle.model}
          </h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {vehicle.type}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
          <div>Year: {vehicle.year}</div>
          <div>Color: {vehicle.color}</div>
          <div>Engine: {vehicle.engine_size}</div>
          <div className="font-medium text-gray-900">
            ${vehicle.price.toLocaleString()}
          </div>
        </div>

        {vehicle.ai_description && (
          <p className="text-sm text-gray-700 line-clamp-2">
            {vehicle.ai_description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default VehicleCard;