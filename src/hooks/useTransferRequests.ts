
import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface TransferRequest {
  id: string;
  from_location_id: string;
  from_location_type: 'store' | 'warehouse';
  to_location_id: string;
  to_location_type: 'store' | 'warehouse';
  sku: string;
  quantity: number;
  status: string;
  priority: string;
  expected_arrival?: string;
  actual_arrival?: string;
  notes?: string;
  requested_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export const useTransferRequests = (locationId?: string, locationType?: 'store' | 'warehouse') => {
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransfers = async () => {
    try {
      let query = supabase.from('transfer_requests').select('*');
      
      if (locationId && locationType) {
        query = query.eq('to_location_id', locationId).eq('to_location_type', locationType);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      setTransfers(data || []);
    } catch (error) {
      console.error('Error fetching transfer requests:', error);
      toast.error('Failed to load transfer requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [locationId, locationType]);

  return {
    transfers,
    loading,
    refetch: fetchTransfers
  };
};
