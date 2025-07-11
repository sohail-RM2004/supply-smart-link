
import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface InventoryItem {
  id: string;
  location_id: string;
  location_type: 'store' | 'warehouse';
  sku: string;
  product_name: string;
  category: string;
  current_stock: number;
  min_threshold: number;
  max_capacity: number;
  unit_cost?: number;
  last_updated: string;
  created_at: string;
}

export const useInventory = (locationId?: string, locationType?: 'store' | 'warehouse') => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      console.log('Fetching inventory data...', { locationId, locationType });
      
      let query = supabase.from('inventory').select('*');
      
      if (locationId && locationType) {
        query = query.eq('location_id', locationId).eq('location_type', locationType);
      }
      
      const { data, error } = await query.order('product_name');

      if (error) {
        console.error('Inventory fetch error:', error);
        throw error;
      }
      
      console.log('Inventory data fetched:', data);
      
      // Type assertion to ensure location_type is properly typed
      const typedData = (data || []).map(item => ({
        ...item,
        location_type: item.location_type as 'store' | 'warehouse'
      }));
      
      setInventory(typedData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();

    // Set up real-time subscription
    const channel = supabase
      .channel('inventory_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory'
        },
        () => {
          console.log('Inventory data changed, refetching...');
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [locationId, locationType]);

  return {
    inventory,
    loading,
    refetch: fetchInventory
  };
};
