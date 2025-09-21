import React from 'react';
import { Link } from 'react-router-dom';
import type { Vehicle } from '../../types';
import { getImageUrl } from '../../utils/api';
import { FaCalendarAlt, FaPalette, FaCog } from 'react-icons/fa';

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
      className="group card-dark card-hover rounded-xl overflow-hidden"
    >
      <div className="aspect-w-16 aspect-h-10 bg-slate-700 relative">
        <img
          src={primaryImage}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-car.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors duration-200">
            {vehicle.brand} {vehicle.model}
          </h3>
          <span className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full shadow-lg">
            {vehicle.type}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-400 mb-4">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt size={16} className="text-blue-400" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaPalette size={16} className="text-blue-400" />
            <span>{vehicle.color}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaCog size={16} className="text-blue-400" />
            <span>{vehicle.engine_size}</span>
          </div>
          <div className="font-bold text-lg text-green-400">
            ${vehicle.price.toLocaleString()}
          </div>
        </div>

        {vehicle.ai_description && (
          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {vehicle.ai_description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default VehicleCard;