import React, { useState, useEffect } from 'react';
import { vehicleAPI } from '../utils/api';
import type { Vehicle, VehicleFilters, PaginatedResponse } from '../types';
import VehicleCard from '../components/vehicles/VehicleCard';
import VehicleFiltersComponent from '../components/vehicles/VehicleFilters';
import Pagination from '../components/common/Pagination';
import Layout from '../components/layout/Layout';
import { getErrorMessage } from '../types/api-error';

const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 12,
  });
  const [filters, setFilters] = useState<VehicleFilters>({
    page: 1,
    limit: 12,
    sortBy: 'created_at',
    sortOrder: 'DESC' as const,
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError('');
      const response: PaginatedResponse<Vehicle> = await vehicleAPI.getVehicles(filters);
      setVehicles(response.items || []);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        limit: response.limit,
      });
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to fetch vehicles');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFiltersChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: 'created_at',
      sortOrder: 'DESC',
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4">
            Vehicle Catalog
          </h1>
          <p className="text-xl text-slate-300">
            Discover our collection of quality vehicles
          </p>
        </div>

        <VehicleFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-blue-500"></div>
              <div className="absolute inset-0 rounded-full animate-pulse bg-blue-500/20"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16 card-dark rounded-xl p-8">
            <div className="text-red-400 mb-6 text-lg">{error}</div>
            <button
              onClick={fetchVehicles}
              className="btn-primary px-6 py-3 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : !vehicles || vehicles.length === 0 ? (
          <div className="text-center py-16 card-dark rounded-xl p-8">
            <h3 className="text-xl font-semibold text-slate-200 mb-3">
              No vehicles found
            </h3>
            <p className="text-slate-400">
              Try adjusting your filters to see more results.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles?.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              )) || []}
            </div>

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default VehicleList;