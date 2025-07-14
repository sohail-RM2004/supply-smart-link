
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Package, TrendingUp, AlertTriangle, Building2, Warehouse, Users } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { useLocations } from '../hooks/useLocations';
import { useSuggestions } from '../hooks/useSuggestions';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const { inventory, loading: inventoryLoading } = useInventory();
  const { stores, warehouses, loading: locationsLoading } = useLocations();
  const { suggestions, loading: suggestionsLoading } = useSuggestions();

  const totalInventory = inventory.reduce((sum, item) => sum + item.current_stock, 0);
  const lowStockItems = inventory.filter(item => item.current_stock <= item.min_threshold);
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');

  if (inventoryLoading || locationsLoading || suggestionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getLocationSpecificStats = () => {
    if (profile?.role === 'store_manager' && profile.linked_store_id) {
      const storeInventory = inventory.filter(item => 
        item.location_type === 'store' && item.location_id === profile.linked_store_id
      );
      return {
        title: 'My Store Overview',
        totalItems: storeInventory.reduce((sum, item) => sum + item.current_stock, 0),
        lowStock: storeInventory.filter(item => item.current_stock <= item.min_threshold).length,
        location: stores.find(s => s.id === profile.linked_store_id)?.name || 'Store'
      };
    } else if (profile?.role === 'warehouse_manager' && profile.linked_warehouse_id) {
      const warehouseInventory = inventory.filter(item => 
        item.location_type === 'warehouse' && item.location_id === profile.linked_warehouse_id
      );
      return {
        title: 'My Warehouse Overview',
        totalItems: warehouseInventory.reduce((sum, item) => sum + item.current_stock, 0),
        lowStock: warehouseInventory.filter(item => item.current_stock <= item.min_threshold).length,
        location: warehouses.find(w => w.id === profile.linked_warehouse_id)?.name || 'Warehouse'
      };
    }
    return {
      title: 'System Overview',
      totalItems: totalInventory,
      lowStock: lowStockItems.length,
      location: 'All Locations'
    };
  };

  const locationStats = getLocationSpecificStats();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to ChainPilot
        </h1>
        <p className="text-gray-600">
          {locationStats.title} • {locationStats.location}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Inventory</p>
              <p className="text-2xl font-bold text-gray-900">{locationStats.totalItems}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-red-600">{locationStats.lowStock}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Suggestions</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingSuggestions.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Locations</p>
              <p className="text-2xl font-bold text-green-600">{stores.length + warehouses.length}</p>
            </div>
            <Building2 className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Recent Inventory Items */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Inventory</h3>
        {inventory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.slice(0, 5).map((item) => {
                  const isLowStock = item.current_stock <= item.min_threshold;
                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.product_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.current_stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {item.location_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isLowStock 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {isLowStock ? 'Low Stock' : 'Good'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No inventory data available</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-blue-500" />
            Stores
          </h3>
          <div className="space-y-3">
            {stores.slice(0, 3).map((store) => (
              <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{store.name}</p>
                  <p className="text-sm text-gray-600">{store.location}</p>
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Store
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Warehouse className="h-5 w-5 mr-2 text-green-500" />
            Warehouses
          </h3>
          <div className="space-y-3">
            {warehouses.slice(0, 3).map((warehouse) => (
              <div key={warehouse.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{warehouse.name}</p>
                  <p className="text-sm text-gray-600">{warehouse.location}</p>
                </div>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  Warehouse
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
