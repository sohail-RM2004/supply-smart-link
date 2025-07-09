
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
  suggested_by: 'ai' | 'manual';
  confidence_score?: number;
  reasoning?: string;
}

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error('Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  };

  const updateSuggestionStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('suggestions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
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
