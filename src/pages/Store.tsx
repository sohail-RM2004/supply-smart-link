
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Package, TrendingUp, AlertTriangle, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useInventory } from '../hooks/useInventory';
import { useLocations } from '../hooks/useLocations';

interface ForecastData {
  date: string;
  predicted_demand: number;
  actual_demand?: number;
}

const Store: React.FC = () => {
  const { storeId } = useParams();
  const { inventory, loading } = useInventory(storeId, 'store');
  const { stores } = useLocations();
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [inboundTransfers, setInboundTransfers] = useState<any[]>([]);

  const currentStore = stores.find(s => s.id === storeId);

  // Mock forecast data for now - this would come from demand_forecasts table
  useEffect(() => {
    const mockForecast: ForecastData[] = [
      { date: '2024-01-16', predicted_demand: 12, actual_demand: 10 },
      { date: '2024-01-17', predicted_demand: 15, actual_demand: 14 },
      { date: '2024-01-18', predicted_demand: 18 },
      { date: '2024-01-19', predicted_demand: 22 },
      { date: '2024-01-20', predicted_demand: 25 },
      { date: '2024-01-21', predicted_demand: 20 },
      { date: '2024-01-22', predicted_demand: 16 },
    ];

    const mockTransfers = [
      {
        id: '1',
        from: 'Central Warehouse',
        sku: 'CLTH-002',
        quantity: 20,
        expected_arrival: '2024-01-17',
        status: 'In Transit'
      },
      {
        id: '2',
        from: 'Warehouse B',
        sku: 'ELEC-001',
        quantity: 30,
        expected_arrival: '2024-01-18',
        status: 'Scheduled'
      }
    ];

    setForecast(mockForecast);
    setInboundTransfers(mockTransfers);
  }, [storeId]);

  const getLowStockItems = () => {
    return inventory.filter(item => item.current_stock <= item.min_threshold);
  };

  const getStockLevel = (item: any) => {
    const percentage = (item.current_stock / item.max_capacity) * 100;
    if (percentage <= 20) return { color: 'bg-red-500', text: 'Critical' };
    if (percentage <= 50) return { color: 'bg-yellow-500', text: 'Low' };
    return { color: 'bg-green-500', text: 'Good' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {currentStore?.name || `Store ${storeId}`}
        </h1>
        <p className="text-gray-600">
          {currentStore?.location} • Inventory Management & Demand Forecasting
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total SKUs</p>
              <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-red-600">{getLowStockItems().length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inbound Transfers</p>
              <p className="text-2xl font-bold text-green-600">{inboundTransfers.length}</p>
            </div>
            <ArrowDown className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Demand Forecast Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          7-Day Demand Forecast
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecast}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Line 
              type="monotone" 
              dataKey="predicted_demand" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Predicted Demand"
            />
            <Line 
              type="monotone" 
              dataKey="actual_demand" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Actual Demand"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Current Inventory */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Current Inventory</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => {
                const stockLevel = getStockLevel(item);
                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.current_stock} / {item.max_capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${stockLevel.color}`}>
                        {stockLevel.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.category}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inbound Transfers */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Suggested Inbound Transfers</h3>
        <div className="space-y-3">
          {inboundTransfers.map((transfer) => (
            <div key={transfer.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{transfer.sku}</p>
                <p className="text-sm text-gray-600">
                  From: {transfer.from} • Quantity: {transfer.quantity} units
                </p>
                <p className="text-sm text-gray-600">
                  Expected: {new Date(transfer.expected_arrival).toLocaleDateString()}
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {transfer.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;
