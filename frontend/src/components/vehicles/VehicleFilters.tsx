import React from 'react';
import type { VehicleFilters as FiltersType } from '../../types';
import { FaSearch } from 'react-icons/fa';

interface VehicleFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  onReset: () => void;
}

const vehicleTypes = ['Car', 'Bike', 'SUV', 'Truck', 'Van'];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const handleFilterChange = (key: keyof FiltersType, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value,
      page: 1, // Reset to first page when filters change
    });
  };

  return (
    <div className="card-dark rounded-xl p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-200 mb-4 lg:mb-0 flex items-center space-x-2">
          <FaSearch size={24} className="text-blue-400" />
          <span>Filter Vehicles</span>
        </h3>
        <button
          onClick={onReset}
          className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Brand, model, description..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input-dark w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Type
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="input-dark w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
          >
            <option value="">All Types</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Brand
          </label>
          <input
            type="text"
            placeholder="Toyota, Honda..."
            value={filters.brand || ''}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="w-full px-3 py-2 input-dark rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Model
          </label>
          <input
            type="text"
            placeholder="Camry, Civic..."
            value={filters.model || ''}
            onChange={(e) => handleFilterChange('model', e.target.value)}
            className="w-full px-3 py-2 input-dark rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Color
          </label>
          <input
            type="text"
            placeholder="Red, Blue..."
            value={filters.color || ''}
            onChange={(e) => handleFilterChange('color', e.target.value)}
            className="w-full px-3 py-2 input-dark rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
          />
        </div>

        {/* Min Year */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Min Year
          </label>
          <select
            value={filters.minYear || ''}
            onChange={(e) => handleFilterChange('minYear', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 input-dark rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
          >
            <option value="">Any Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Max Year */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Max Year
          </label>
          <select
            value={filters.maxYear || ''}
            onChange={(e) => handleFilterChange('maxYear', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 input-dark rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
          >
            <option value="">Any Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Min Price ($)
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.minPrice || ''}
            onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 input-dark rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Max Price ($)
          </label>
          <input
            type="number"
            placeholder="100000"
            value={filters.maxPrice || ''}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 input-dark rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Sort By
          </label>
          <select
            value={`${filters.sortBy || 'created_at'}-${filters.sortOrder || 'DESC'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              onFiltersChange({
                ...filters,
                sortBy: sortBy as string,
                sortOrder: sortOrder as 'ASC' | 'DESC',
              });
            }}
            className="w-full px-3 py-2 input-dark rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
          >
            <option value="created_at-DESC">Newest First</option>
            <option value="created_at-ASC">Oldest First</option>
            <option value="price-ASC">Price: Low to High</option>
            <option value="price-DESC">Price: High to Low</option>
            <option value="year-DESC">Year: Newest</option>
            <option value="year-ASC">Year: Oldest</option>
            <option value="brand-ASC">Brand: A-Z</option>
            <option value="brand-DESC">Brand: Z-A</option>
          </select>
        </div>

        {/* Items per page */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Items per page
          </label>
          <select
            value={filters.limit || 10}
            onChange={(e) => handleFilterChange('limit', Number(e.target.value))}
            className="w-full px-3 py-2 input-dark rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default VehicleFilters;