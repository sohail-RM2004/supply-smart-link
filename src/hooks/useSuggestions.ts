
import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface Suggestion {
  id: string;
  message: string;
  from_location_id: string;
  from_location_type: 'store' | 'warehouse';
  to_location_id: string;
  to_location_type: 'store' | 'warehouse';
  sku: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  updated_at: string;
  suggested_by: 'ai' | 'manual';
  confidence_score?: number;
  reasoning?: string;
}

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    try {
      console.log('Fetching suggestions data...');
      
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Suggestions fetch error:', error);
        throw error;
      }
      
      console.log('Suggestions data fetched:', data);
      
      // Type assertion to ensure location types and other enums are properly typed
      const typedData = (data || []).map(item => ({
        ...item,
        from_location_type: item.from_location_type as 'store' | 'warehouse',
        to_location_type: item.to_location_type as 'store' | 'warehouse',
        status: item.status as 'pending' | 'approved' | 'rejected',
        priority: item.priority as 'high' | 'medium' | 'low',
        suggested_by: item.suggested_by as 'ai' | 'manual'
      }));
      
      setSuggestions(typedData);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  const updateSuggestionStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      console.log('Updating suggestion status:', { id, status });
      
      const { error } = await supabase
        .from('suggestions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating suggestion:', error);
        throw error;
      }
      
      setSuggestions(prev => 
        prev.map(s => s.id === id ? { ...s, status } : s)
      );
      
      return true;
    } catch (error) {
      console.error('Error updating suggestion:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchSuggestions();

    // Set up real-time subscription
    const channel = supabase
      .channel('suggestions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'suggestions'
        },
        () => {
          console.log('Suggestions data changed, refetching...');
          fetchSuggestions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    suggestions,
    loading,
    updateSuggestionStatus,
    refetch: fetchSuggestions
  };
};
