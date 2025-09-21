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
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="mt-2 text-gray-600">Manage your vehicle inventory</p>
            </div>
            <button
              onClick={handleAddVehicle}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add New Vehicle
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
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
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Vehicle Inventory ({vehicles?.length || 0})
                </h2>
              </div>

              {!vehicles || vehicles.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No vehicles found. Add your first vehicle to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vehicles?.map((vehicle) => (
                        <tr key={vehicle.id} className="hover:bg-gray-50">
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
                                <div className="text-sm font-medium text-gray-900">
                                  {vehicle.brand} {vehicle.model}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {vehicle.type}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {vehicle.year} • {vehicle.color}
                            </div>
                            <div className="text-sm text-gray-500">
                              {vehicle.engine_size}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ${vehicle.price.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(vehicle.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleRegenerateDescription(vehicle)}
                              className="text-green-600 hover:text-green-900"
                              title="Regenerate AI Description"
                            >
                              AI
                            </button>
                            <button
                              onClick={() => handleEditVehicle(vehicle)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              className="text-red-600 hover:text-red-900"
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