
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Suggestion {
  id: string;
  message: string;
  from_location: string;
  to_location: string;
  sku: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  suggested_by: 'ai' | 'manual';
}

const Suggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockSuggestions: Suggestion[] = [
      {
        id: '1',
        message: 'Transfer electronics to meet expected demand surge',
        from_location: 'Warehouse A',
        to_location: 'Store B',
        sku: 'ELEC-001',
        quantity: 25,
        status: 'pending',
        priority: 'high',
        created_at: '2024-01-15T10:30:00Z',
        suggested_by: 'ai'
      },
      {
        id: '2',
        message: 'Restock groceries before weekend rush',
        from_location: 'Central Warehouse',
        to_location: 'Store C',
        sku: 'GROC-045',
        quantity: 100,
        status: 'approved',
        priority: 'medium',
        created_at: '2024-01-15T09:15:00Z',
        suggested_by: 'ai'
      },
      {
        id: '3',
        message: 'Move seasonal items to high-traffic location',
        from_location: 'Warehouse B',
        to_location: 'Store A',
        sku: 'SEAS-123',
        quantity: 50,
        status: 'rejected',
        priority: 'low',
        created_at: '2024-01-14T16:45:00Z',
        suggested_by: 'manual'
      },
      {
        id: '4',
        message: 'Emergency restock due to supply chain disruption',
        from_location: 'Backup Warehouse',
        to_location: 'Store D',
        sku: 'EMRG-789',
        quantity: 75,
        status: 'pending',
        priority: 'high',
        created_at: '2024-01-15T14:20:00Z',
        suggested_by: 'ai'
      }
    ];

    setTimeout(() => {
      setSuggestions(mockSuggestions);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setSuggestions(prev => 
        prev.map(s => s.id === id ? { ...s, status: 'approved' as const } : s)
      );
      toast.success('Suggestion approved successfully');
    } catch (error) {
      toast.error('Failed to approve suggestion');
    }
  };

  const handleReject = async (id: string) => {
    try {
      setSuggestions(prev => 
        prev.map(s => s.id === id ? { ...s, status: 'rejected' as const } : s)
      );
      toast.success('Suggestion rejected');
    } catch (error) {
      toast.error('Failed to reject suggestion');
    }
  };

  const filteredSuggestions = suggestions.filter(s => 
    filter === 'all' || s.status === filter
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">AI Transfer Suggestions</h1>
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Suggestions</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{suggestions.length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {suggestions.filter(s => s.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {suggestions.filter(s => s.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {suggestions.filter(s => s.status === 'rejected').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getStatusIcon(suggestion.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                    {suggestion.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {suggestion.suggested_by === 'ai' ? '🤖 AI Suggested' : '👤 Manual'}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {suggestion.message}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">From:</span> {suggestion.from_location}
                  </div>
                  <div>
                    <span className="font-medium">To:</span> {suggestion.to_location}
                  </div>
                  <div>
                    <span className="font-medium">SKU:</span> {suggestion.sku}
                  </div>
                  <div>
                    <span className="font-medium">Quantity:</span> {suggestion.quantity} units
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(suggestion.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {suggestion.status === 'pending' && (
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleApprove(suggestion.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(suggestion.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSuggestions.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No suggestions found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default Suggestions;
