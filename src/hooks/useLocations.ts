
import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface Store {
  id: string;
  name: string;
  location: string;
  address?: string;
  manager_id?: string;
  max_capacity: number;
  created_at: string;
  updated_at: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  address?: string;
  manager_id?: string;
  max_capacity: number;
  temperature_controlled?: boolean;
  created_at: string;
  updated_at: string;
}

export const useLocations = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const [storesResult, warehousesResult] = await Promise.all([
        supabase.from('stores').select('*').order('name'),
        supabase.from('warehouses').select('*').order('name')
      ]);

      if (storesResult.error) throw storesResult.error;
      if (warehousesResult.error) throw warehousesResult.error;

      setStores(storesResult.data || []);
      setWarehouses(warehousesResult.data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return {
    stores,
    warehouses,
    loading,
    refetch: fetchLocations
  };
};
