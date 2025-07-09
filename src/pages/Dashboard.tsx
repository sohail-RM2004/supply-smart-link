
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  Clock,
  Cloud,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalStockAlerts: number;
  pendingTransfers: number;
  todaySuggestions: number;
  lowInventoryItems: number;
}

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalStockAlerts: 0,
    pendingTransfers: 0,
    todaySuggestions: 0,
    lowInventoryItems: 0
  });

  // Mock data for demonstration
  const mockInventoryData = [
    { name: 'Electronics', value: 400, color: '#0088FE' },
    { name: 'Clothing', value: 300, color: '#00C49F' },
    { name: 'Groceries', value: 300, color: '#FFBB28' },
    { name: 'Home & Garden', value: 200, color: '#FF8042' },
  ];

  const mockTransferData = [
    { day: 'Mon', transfers: 12 },
    { day: 'Tue', transfers: 19 },
    { day: 'Wed', transfers: 8 },
    { day: 'Thu', transfers: 15 },
    { day: 'Fri', transfers: 22 },
    { day: 'Sat', transfers: 18 },
    { day: 'Sun', transfers: 10 },
  ];

  useEffect(() => {
    // Simulate API call
    setStats({
      totalStockAlerts: 23,
      pendingTransfers: 8,
      todaySuggestions: 5,
      lowInventoryItems: 12
    });
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {profile?.role?.replace('_', ' ')}!
        </h1>
        <p className="text-blue-100">
          Here's your supply chain overview for today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Stock Alerts"
          value={stats.totalStockAlerts}
          icon={AlertTriangle}
          color="bg-red-500"
          trend="+12% from last week"
        />
        <StatCard
          title="Pending Transfers"
          value={stats.pendingTransfers}
          icon={Package}
          color="bg-blue-500"
          trend="-5% from yesterday"
        />
        <StatCard
          title="Today's Suggestions"
          value={stats.todaySuggestions}
          icon={TrendingUp}
          color="bg-green-500"
          trend="+8% efficiency"
        />
        <StatCard
          title="Low Inventory Items"
          value={stats.lowInventoryItems}
          icon={Clock}
          color="bg-orange-500"
          trend="Needs attention"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transfer Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Weekly Transfer Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockTransferData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="transfers" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Inventory Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockInventoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockInventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather & Events */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Cloud className="h-5 w-5 mr-2 text-blue-500" />
            Weather & Events Impact
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">Sunny Weather</p>
                <p className="text-sm text-gray-600">Increased outdoor equipment demand</p>
              </div>
              <span className="text-green-600 font-semibold">+15%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                <div>
                  <p className="font-medium">Holiday Weekend</p>
                  <p className="text-sm text-gray-600">Expected surge in grocery sales</p>
                </div>
              </div>
              <span className="text-orange-600 font-semibold">+25%</span>
            </div>
          </div>
        </div>

        {/* Recent Suggestions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent AI Suggestions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Transfer SKU-123</p>
                <p className="text-sm text-gray-600">Warehouse A → Store B</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">High Priority</span>
                <ArrowRight className="h-4 w-4 ml-2 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Restock Electronics</p>
                <p className="text-sm text-gray-600">Store C needs 50 units</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Medium</span>
                <ArrowRight className="h-4 w-4 ml-2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
