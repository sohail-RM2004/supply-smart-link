
import React, { useState } from 'react';
import { Settings, Key, Zap, BarChart3, RefreshCw, Cloud } from 'lucide-react';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const [weatherApiKey, setWeatherApiKey] = useState('');
  const [holidayApiKey, setHolidayApiKey] = useState('');
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveApiKeys = async () => {
    setLoading(true);
    try {
      // In a real app, this would save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('API keys saved successfully');
    } catch (error) {
      toast.error('Failed to save API keys');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerAutomation = async () => {
    setLoading(true);
    try {
      if (!n8nWebhookUrl) {
        toast.error('Please set the n8n webhook URL first');
        return;
      }

      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trigger: 'manual_forecast',
          timestamp: new Date().toISOString(),
          source: 'chainpilot_admin'
        }),
      });

      if (response.ok) {
        toast.success('Automation triggered successfully');
      } else {
        throw new Error('Failed to trigger automation');
      }
    } catch (error) {
      toast.error('Failed to trigger automation');
    } finally {
      setLoading(false);
    }
  };

  const systemLogs = [
    {
      id: '1',
      timestamp: '2024-01-15T10:30:00Z',
      level: 'INFO',
      message: 'Daily forecast generation completed successfully',
      module: 'Forecasting Engine'
    },
    {
      id: '2',
      timestamp: '2024-01-15T09:15:00Z',
      level: 'WARNING',
      message: 'Weather API rate limit approaching (80% used)',
      module: 'Weather Service'
    },
    {
      id: '3',
      timestamp: '2024-01-15T08:45:00Z',
      level: 'SUCCESS',
      message: 'Transfer suggestion approved: ELEC-001 (25 units)',
      module: 'Transfer Manager'
    },
    {
      id: '4',
      timestamp: '2024-01-15T08:30:00Z',
      level: 'ERROR',
      message: 'Failed to connect to external supplier API',
      module: 'Supplier Integration'
    }
  ];

  const forecastAccuracy = [
    { category: 'Electronics', accuracy: 89, variance: 5.2 },
    { category: 'Clothing', accuracy: 92, variance: 3.8 },
    { category: 'Groceries', accuracy: 95, variance: 2.1 },
    { category: 'Home & Garden', accuracy: 87, variance: 6.3 }
  ];

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800';
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'INFO': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Settings className="h-6 w-6 mr-2 text-blue-500" />
          Admin Dashboard
        </h1>
        <p className="text-gray-600">System configuration and monitoring</p>
      </div>

      {/* API Configuration */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Key className="h-5 w-5 mr-2 text-blue-500" />
          API Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weather API Key
            </label>
            <input
              type="password"
              value={weatherApiKey}
              onChange={(e) => setWeatherApiKey(e.target.value)}
              placeholder="Enter your weather API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Holiday API Key
            </label>
            <input
              type="password"
              value={holidayApiKey}
              onChange={(e) => setHolidayApiKey(e.target.value)}
              placeholder="Enter your holiday API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              n8n Webhook URL
            </label>
            <input
              type="url"
              value={n8nWebhookUrl}
              onChange={(e) => setN8nWebhookUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSaveApiKeys}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {/* Manual Automation Trigger */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          Manual Automation Trigger
        </h3>
        <p className="text-gray-600 mb-4">
          Manually trigger the AI forecasting and transfer suggestion automation
        </p>
        <button
          onClick={handleTriggerAutomation}
          disabled={loading}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 flex items-center"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Triggering...' : 'Trigger Automation'}
        </button>
      </div>

      {/* Forecast Accuracy */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
          Forecast vs Actuals
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forecastAccuracy.map((item) => (
                <tr key={item.category}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.accuracy}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ±{item.variance}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.accuracy >= 90 ? 'bg-green-100 text-green-800' : 
                      item.accuracy >= 85 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.accuracy >= 90 ? 'Excellent' : item.accuracy >= 85 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Logs */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Cloud className="h-5 w-5 mr-2 text-gray-500" />
          System Logs
        </h3>
        <div className="space-y-3">
          {systemLogs.map((log) => (
            <div key={log.id} className="flex items-start justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLogLevelColor(log.level)}`}>
                    {log.level}
                  </span>
                  <span className="text-sm text-gray-500">{log.module}</span>
                </div>
                <p className="text-sm text-gray-900">{log.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
