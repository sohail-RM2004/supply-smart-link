
import React from 'react';
import { CheckCircle, XCircle, Clock, TrendingUp, Package, ArrowRight } from 'lucide-react';
import { useSuggestions } from '../hooks/useSuggestions';
import { useLocations } from '../hooks/useLocations';
import { toast } from 'sonner';

const Suggestions: React.FC = () => {
  const { suggestions, loading, updateSuggestionStatus } = useSuggestions();
  const { stores, warehouses } = useLocations();

  const handleApprove = async (id: string) => {
    const success = await updateSuggestionStatus(id, 'approved');
    if (success) {
      toast.success('Suggestion approved successfully');
    } else {
      toast.error('Failed to approve suggestion');
    }
  };

  const handleReject = async (id: string) => {
    const success = await updateSuggestionStatus(id, 'rejected');
    if (success) {
      toast.success('Suggestion rejected');
    } else {
      toast.error('Failed to reject suggestion');
    }
  };

  const getLocationName = (locationId: string, locationType: 'store' | 'warehouse') => {
    if (locationType === 'store') {
      return stores.find(s => s.id === locationId)?.name || 'Unknown Store';
    } else {
      return warehouses.find(w => w.id === locationId)?.name || 'Unknown Warehouse';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
  const processedSuggestions = suggestions.filter(s => s.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-blue-500" />
          AI Optimization Suggestions
        </h1>
        <p className="text-gray-600">
          Review and manage AI-generated recommendations for inventory optimization
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Suggestions</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingSuggestions.length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Today</p>
              <p className="text-2xl font-bold text-green-600">
                {processedSuggestions.filter(s => s.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Suggestions</p>
              <p className="text-2xl font-bold text-blue-600">{suggestions.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Pending Suggestions */}
      {pendingSuggestions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Pending Suggestions</h3>
          <div className="space-y-4">
            {pendingSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                        {suggestion.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className="text-xs text-gray-500">
                        {suggestion.suggested_by === 'ai' ? '🤖 AI Generated' : '👤 Manual'}
                      </span>
                      {suggestion.confidence_score && (
                        <span className="text-xs text-gray-500">
                          {Math.round(suggestion.confidence_score * 100)}% confidence
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-900 font-medium mb-2">{suggestion.message}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span>SKU: {suggestion.sku}</span>
                      <span>Quantity: {suggestion.quantity}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{getLocationName(suggestion.from_location_id, suggestion.from_location_type)}</span>
                      <ArrowRight className="h-4 w-4" />
                      <span>{getLocationName(suggestion.to_location_id, suggestion.to_location_type)}</span>
                    </div>
                    
                    {suggestion.reasoning && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        Reasoning: {suggestion.reasoning}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleApprove(suggestion.id)}
                      className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(suggestion.id)}
                      className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Suggestions */}
      {processedSuggestions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Decisions</h3>
          <div className="space-y-3">
            {processedSuggestions.slice(0, 10).map((suggestion) => (
              <div key={suggestion.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(suggestion.status)}
                  <div>
                    <p className="font-medium text-sm">{suggestion.message}</p>
                    <p className="text-xs text-gray-500">
                      {getLocationName(suggestion.from_location_id, suggestion.from_location_type)} → {getLocationName(suggestion.to_location_id, suggestion.to_location_type)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    suggestion.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {suggestion.status.toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(suggestion.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestions.length === 0 && (
        <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
          <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions available</h3>
          <p className="text-gray-500">
            The AI will generate optimization suggestions based on your inventory data and demand patterns.
          </p>
        </div>
      )}
    </div>
  );
};

export default Suggestions;
