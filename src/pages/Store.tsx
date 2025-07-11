
import React from 'react';
import { useParams } from 'react-router-dom';
import { Package, TrendingUp, AlertTriangle, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useInventory } from '../hooks/useInventory';
import { useLocations } from '../hooks/useLocations';
import { useDemandForecasts } from '../hooks/useDemandForecasts';
import { useTransferRequests } from '../hooks/useTransferRequests';

const Store: React.FC = () => {
  const { storeId } = useParams();
  const { inventory, loading: inventoryLoading } = useInventory(storeId, 'store');
  const { stores } = useLocations();
  const { forecasts, loading: forecastsLoading } = useDemandForecasts(storeId, 'store');
  const { transfers, loading: transfersLoading } = useTransferRequests(storeId, 'store');

  const currentStore = stores.find(s => s.id === storeId);

  const getLowStockItems = () => {
    return inventory.filter(item => item.current_stock <= item.min_threshold);
  };

  const getStockLevel = (item: any) => {
    const percentage = (item.current_stock / item.max_capacity) * 100;
    if (percentage <= 20) return { color: 'bg-red-500', text: 'Critical' };
    if (percentage <= 50) return { color: 'bg-yellow-500', text: 'Low' };
    return { color: 'bg-green-500', text: 'Good' };
  };

  const formatChartData = () => {
    return forecasts.map(forecast => ({
      date: forecast.forecast_date,
      predicted_demand: forecast.predicted_demand,
      actual_demand: forecast.actual_demand
    }));
  };

  const formatTransferData = () => {
    return transfers.map(transfer => ({
      id: transfer.id,
      sku: transfer.sku,
      quantity: transfer.quantity,
      expected_arrival: transfer.expected_arrival,
      status: transfer.status,
      from: transfer.from_location_type === 'warehouse' ? 'Warehouse' : 'Store'
    }));
  };

  if (inventoryLoading || forecastsLoading || transfersLoading) {
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
              <p className="text-2xl font-bold text-green-600">{transfers.length}</p>
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
        {forecasts.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formatChartData()}>
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
        ) : (
          <p className="text-gray-500 text-center py-8">No forecast data available</p>
        )}
      </div>

      {/* Current Inventory */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Current Inventory</h3>
        {inventory.length > 0 ? (
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
        ) : (
          <p className="text-gray-500 text-center py-8">No inventory data available</p>
        )}
      </div>

      {/* Inbound Transfers */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Inbound Transfers</h3>
        {transfers.length > 0 ? (
          <div className="space-y-3">
            {formatTransferData().map((transfer) => (
              <div key={transfer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{transfer.sku}</p>
                  <p className="text-sm text-gray-600">
                    From: {transfer.from} • Quantity: {transfer.quantity} units
                  </p>
                  {transfer.expected_arrival && (
                    <p className="text-sm text-gray-600">
                      Expected: {new Date(transfer.expected_arrival).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                  {transfer.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No transfer requests available</p>
        )}
      </div>
    </div>
  );
};

export default Store;
