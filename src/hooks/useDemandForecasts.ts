
import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface DemandForecast {
  id: string;
  location_id: string;
  location_type: 'store' | 'warehouse';
  sku: string;
  forecast_date: string;
  predicted_demand: number;
  actual_demand?: number;
  confidence_score?: number;
  seasonal_factor?: number;
  weather_factor?: number;
  created_at: string;
}

export const useDemandForecasts = (locationId?: string, locationType?: 'store' | 'warehouse') => {
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchForecasts = async () => {
    try {
      let query = supabase.from('demand_forecasts').select('*');
      
      if (locationId && locationType) {
        query = query
          .eq('location_id', locationId)
          .eq('location_type', locationType);
      }
      
      const { data, error } = await query
        .order('forecast_date', { ascending: true })
        .limit(7);

      if (error) throw error;
      
      setForecasts(data || []);
    } catch (error) {
      console.error('Error fetching demand forecasts:', error);
      toast.error('Failed to load demand forecasts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecasts();
  }, [locationId, locationType]);

  return {
    forecasts,
    loading,
    refetch: fetchForecasts
  };
};
