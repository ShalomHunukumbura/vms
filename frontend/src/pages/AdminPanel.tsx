import React, { useState, useEffect } from 'react';
import { vehicleAPI, aiAPI, getImageUrl } from '../utils/api';
import type { Vehicle, VehicleFormData } from '../types';
import Layout from '../components/layout/Layout';
import VehicleForm from '../components/admin/VehicleForm';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { getErrorMessage } from '../types/api-error';

const AdminPanel: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>();
  const [formLoading, setFormLoading] = useState(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await vehicleAPI.getVehicles({ limit: 100 });
      setVehicles(response.items || []);
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to fetch vehicles');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAddVehicle = () => {
    setEditingVehicle(undefined);
    setShowForm(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDeleteVehicle = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      await vehicleAPI.deleteVehicle(id.toString());
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to delete vehicle');
    }
  };

  const handleFormSubmit = async (formData: VehicleFormData) => {
    try {
      setFormLoading(true);
      if (editingVehicle) {
        await vehicleAPI.updateVehicle(
          editingVehicle.id.toString(),
          formData
        );
        await fetchVehicles(); // Refresh the entire list
      } else {
        await vehicleAPI.createVehicle(formData);
        await fetchVehicles(); // Refresh the entire list
      }
      setShowForm(false);
      setEditingVehicle(undefined);
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to save vehicle');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingVehicle(undefined);
  };

  const handleRegenerateDescription = async (vehicle: Vehicle) => {
    try {
      const description = await aiAPI.regenerateDescription(vehicle.id.toString());
      setVehicles(vehicles.map(v =>
        v.id === vehicle.id ? { ...v, ai_description: description } : v
      ));
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to regenerate description');
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <Layout>
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="mt-2 text-slate-300 text-lg">Manage your vehicle inventory</p>
            </div>
            <button
              onClick={handleAddVehicle}
              className="btn-primary px-6 py-3 rounded-lg font-medium"
            >
              Add New Vehicle
            </button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {showForm && (
            <VehicleForm
              vehicle={editingVehicle}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={formLoading}
            />
          )}

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-blue-500"></div>
                <div className="absolute inset-0 rounded-full animate-pulse bg-blue-500/20"></div>
              </div>
            </div>
          ) : (
            <div className="card-dark rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-slate-200">
                  Vehicle Inventory ({vehicles?.length || 0})
                </h2>
              </div>

              {!vehicles || vehicles.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  No vehicles found. Add your first vehicle to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-800/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {vehicles?.map((vehicle) => (
                        <tr key={vehicle.id} className="hover:bg-slate-800/50  transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <img
                                  className="h-12 w-12 rounded-md object-cover"
                                  src={
                                    vehicle.images && vehicle.images.length > 0
                                      ? getImageUrl(vehicle.images[0])
                                      : '/placeholder-car.jpg'
                                  }
                                  alt={`${vehicle.brand} ${vehicle.model}`}
                                  onError={(e) => {
                                    e.currentTarget.src = '/placeholder-car.jpg';
                                  }}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">
                                  {vehicle.brand} {vehicle.model}
                                </div>
                                <div className="text-sm text-slate-400">
                                  {vehicle.type}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-200">
                              {vehicle.year} • {vehicle.color}
                            </div>
                            <div className="text-sm text-slate-400">
                              {vehicle.engine_size}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-green-400">
                              ${vehicle.price.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                            {new Date(vehicle.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                            <button
                              onClick={() => handleRegenerateDescription(vehicle)}
                              className="text-green-400 hover:text-green-300 transition-colors duration-200 font-medium"
                              title="Regenerate AI Description"
                            >
                              AI
                            </button>
                            <button
                              onClick={() => handleEditVehicle(vehicle)}
                              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-200 font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminPanel;