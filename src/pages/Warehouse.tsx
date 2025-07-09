
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Package, TrendingUp, ArrowUpRight, ArrowDownLeft, Thermometer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface WarehouseData {
  total_capacity: number;
  current_stock: number;
  outgoing_transfers: number;
  incoming_transfers: number;
}

interface TransferLog {
  id: string;
  type: 'incoming' | 'outgoing';
  from: string;
  to: string;
  sku: string;
  quantity: number;
  date: string;
  status: string;
}

const Warehouse: React.FC = () => {
  const { warehouseId } = useParams();
  const [warehouseData, setWarehouseData] = useState<WarehouseData | null>(null);
  const [transferLogs, setTransferLogs] = useState<TransferLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockWarehouseData: WarehouseData = {
      total_capacity: 10000,
      current_stock: 7500,
      outgoing_transfers: 12,
      incoming_transfers: 8
    };

    const mockTransferLogs: TransferLog[] = [
      {
        id: '1',
        type: 'outgoing',
        from: 'Warehouse A',
        to: 'Store B',
        sku: 'ELEC-001',
        quantity: 25,
        date: '2024-01-15T10:30:00Z',
        status: 'completed'
      },
      {
        id: '2',
        type: 'incoming',
        from: 'Supplier XYZ',
        to: 'Warehouse A',
        sku: 'GROC-045',
        quantity: 500,
        date: '2024-01-15T14:15:00Z',
        status: 'pending'
      },
      {
        id: '3',
        type: 'outgoing',
        from: 'Warehouse A',
        to: 'Store C',
        sku: 'CLTH-002',
        quantity: 30,
        date: '2024-01-14T16:45:00Z',
        status: 'in_transit'
      },
      {
        id: '4',
        type: 'incoming',
        from: 'Manufacturing Plant',
        to: 'Warehouse A',
        sku: 'HOME-004',
        quantity: 150,
        date: '2024-01-14T09:20:00Z',
        status: 'completed'
      }
    ];

    setTimeout(() => {
      setWarehouseData(mockWarehouseData);
      setTransferLogs(mockTransferLogs);
      setLoading(false);
    }, 1000);
  }, [warehouseId]);

  const capacityData = warehouseData ? [
    { name: 'Used', value: warehouseData.current_stock, color: '#3B82F6' },
    { name: 'Available', value: warehouseData.total_capacity - warehouseData.current_stock, color: '#E5E7EB' }
  ] : [];

  const transferTrendData = [
    { day: 'Mon', incoming: 5, outgoing: 8 },
    { day: 'Tue', incoming: 12, outgoing: 6 },
    { day: 'Wed', incoming: 8, outgoing: 10 },
    { day: 'Thu', incoming: 15, outgoing: 12 },
    { day: 'Fri', incoming: 10, outgoing: 14 },
    { day: 'Sat', incoming: 6, outgoing: 8 },
    { day: 'Sun', incoming: 4, outgoing: 5 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Warehouse {warehouseId}</h1>
        <p className="text-gray-600">Capacity Management & Transfer Operations</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Capacity Used</p>
              <p className="text-2xl font-bold text-gray-900">
                {warehouseData ? Math.round((warehouseData.current_stock / warehouseData.total_capacity) * 100) : 0}%
              </p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {warehouseData?.current_stock.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outgoing Today</p>
              <p className="text-2xl font-bold text-orange-600">
                {warehouseData?.outgoing_transfers}
              </p>
            </div>
            <ArrowUpRight className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Incoming Today</p>
              <p className="text-2xl font-bold text-green-600">
                {warehouseData?.incoming_transfers}
              </p>
            </div>
            <ArrowDownLeft className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity Usage */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Capacity Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={capacityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {capacityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Transfer Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Weekly Transfer Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transferTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incoming" fill="#10B981" name="Incoming" />
              <Bar dataKey="outgoing" fill="#F59E0B" name="Outgoing" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weather Impact */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Thermometer className="h-5 w-5 mr-2 text-blue-500" />
          Weather & Location Impact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-900">Temperature: 72°F</p>
            <p className="text-sm text-blue-700">Optimal for electronics storage</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="font-medium text-green-900">Humidity: 45%</p>
            <p className="text-sm text-green-700">Within acceptable range</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="font-medium text-yellow-900">Weather Alert</p>
            <p className="text-sm text-yellow-700">Storm expected tomorrow - plan accordingly</p>
          </div>
        </div>
      </div>

      {/* Transfer Logs */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Transfer Activity</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transferLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {log.type === 'incoming' ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-orange-500 mr-2" />
                      )}
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {log.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.from} → {log.to}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Warehouse;
