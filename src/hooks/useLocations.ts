
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

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('name');

      if (error) throw error;
      setStores(data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to load stores');
    }
  };

  const fetchWarehouses = async () => {
    try {
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .order('name');

      if (error) throw error;
      setWarehouses(data || []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      toast.error('Failed to load warehouses');
    }
  };

  const fetchLocations = async () => {
    setLoading(true);
    await Promise.all([fetchStores(), fetchWarehouses()]);
    setLoading(false);
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
