
-- Create stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  manager_id UUID REFERENCES public.profiles(id),
  max_capacity INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create warehouses table
CREATE TABLE public.warehouses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  manager_id UUID REFERENCES public.profiles(id),
  max_capacity INTEGER NOT NULL DEFAULT 10000,
  temperature_controlled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory table
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL,
  location_type TEXT NOT NULL CHECK (location_type IN ('store', 'warehouse')),
  sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  min_threshold INTEGER NOT NULL DEFAULT 10,
  max_capacity INTEGER NOT NULL DEFAULT 100,
  unit_cost DECIMAL(10,2),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(location_id, location_type, sku)
);

-- Create transfer_requests table
CREATE TABLE public.transfer_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_location_id UUID NOT NULL,
  from_location_type TEXT NOT NULL CHECK (from_location_type IN ('store', 'warehouse')),
  to_location_id UUID NOT NULL,
  to_location_type TEXT NOT NULL CHECK (to_location_type IN ('store', 'warehouse')),
  sku TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_transit', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  requested_by UUID REFERENCES public.profiles(id),
  approved_by UUID REFERENCES public.profiles(id),
  expected_arrival TIMESTAMP WITH TIME ZONE,
  actual_arrival TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create suggestions table (AI-generated transfer suggestions)
CREATE TABLE public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  from_location_id UUID NOT NULL,
  from_location_type TEXT NOT NULL CHECK (from_location_type IN ('store', 'warehouse')),
  to_location_id UUID NOT NULL,
  to_location_type TEXT NOT NULL CHECK (to_location_type IN ('store', 'warehouse')),
  sku TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  suggested_by TEXT NOT NULL DEFAULT 'ai' CHECK (suggested_by IN ('ai', 'manual')),
  confidence_score DECIMAL(3,2) DEFAULT 0.85,
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create demand_forecasts table
CREATE TABLE public.demand_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL,
  location_type TEXT NOT NULL CHECK (location_type IN ('store', 'warehouse')),
  sku TEXT NOT NULL,
  forecast_date DATE NOT NULL,
  predicted_demand INTEGER NOT NULL,
  actual_demand INTEGER,
  confidence_score DECIMAL(3,2) DEFAULT 0.80,
  weather_factor DECIMAL(3,2),
  seasonal_factor DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(location_id, location_type, sku, forecast_date)
);

-- Create transfer_logs table (historical records)
CREATE TABLE public.transfer_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transfer_request_id UUID REFERENCES public.transfer_requests(id),
  from_location_id UUID NOT NULL,
  from_location_type TEXT NOT NULL CHECK (from_location_type IN ('store', 'warehouse')),
  to_location_id UUID NOT NULL,
  to_location_type TEXT NOT NULL CHECK (to_location_type IN ('store', 'warehouse')),
  sku TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  status TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_by UUID REFERENCES public.profiles(id),
  notes TEXT
);

-- Enable Row Level Security on all tables
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for stores
CREATE POLICY "Admins can manage all stores" ON public.stores FOR ALL USING (public.get_current_user_role() = 'admin');
CREATE POLICY "Store managers can view their store" ON public.stores FOR SELECT USING (manager_id = auth.uid() OR public.get_current_user_role() = 'admin');

-- RLS Policies for warehouses  
CREATE POLICY "Admins can manage all warehouses" ON public.warehouses FOR ALL USING (public.get_current_user_role() = 'admin');
CREATE POLICY "Warehouse managers can view their warehouse" ON public.warehouses FOR SELECT USING (manager_id = auth.uid() OR public.get_current_user_role() = 'admin');

-- RLS Policies for inventory
CREATE POLICY "Admins can manage all inventory" ON public.inventory FOR ALL USING (public.get_current_user_role() = 'admin');
CREATE POLICY "Store managers can view their store inventory" ON public.inventory FOR SELECT USING (
  public.get_current_user_role() = 'admin' OR
  (location_type = 'store' AND location_id IN (SELECT id FROM public.stores WHERE manager_id = auth.uid()))
);
CREATE POLICY "Warehouse managers can view their warehouse inventory" ON public.inventory FOR SELECT USING (
  public.get_current_user_role() = 'admin' OR
  (location_type = 'warehouse' AND location_id IN (SELECT id FROM public.warehouses WHERE manager_id = auth.uid()))
);

-- RLS Policies for transfer_requests
CREATE POLICY "Admins can manage all transfer requests" ON public.transfer_requests FOR ALL USING (public.get_current_user_role() = 'admin');
CREATE POLICY "Users can view relevant transfer requests" ON public.transfer_requests FOR SELECT USING (
  public.get_current_user_role() = 'admin' OR
  requested_by = auth.uid() OR
  from_location_id IN (SELECT id FROM public.stores WHERE manager_id = auth.uid()) OR
  to_location_id IN (SELECT id FROM public.stores WHERE manager_id = auth.uid()) OR
  from_location_id IN (SELECT id FROM public.warehouses WHERE manager_id = auth.uid()) OR
  to_location_id IN (SELECT id FROM public.warehouses WHERE manager_id = auth.uid())
);
CREATE POLICY "Users can create transfer requests" ON public.transfer_requests FOR INSERT WITH CHECK (requested_by = auth.uid());

-- RLS Policies for suggestions
CREATE POLICY "All authenticated users can view suggestions" ON public.suggestions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage suggestions" ON public.suggestions FOR ALL USING (public.get_current_user_role() = 'admin');

-- RLS Policies for demand_forecasts
CREATE POLICY "Admins can manage all forecasts" ON public.demand_forecasts FOR ALL USING (public.get_current_user_role() = 'admin');
CREATE POLICY "Store managers can view their store forecasts" ON public.demand_forecasts FOR SELECT USING (
  public.get_current_user_role() = 'admin' OR
  (location_type = 'store' AND location_id IN (SELECT id FROM public.stores WHERE manager_id = auth.uid()))
);
CREATE POLICY "Warehouse managers can view their warehouse forecasts" ON public.demand_forecasts FOR SELECT USING (
  public.get_current_user_role() = 'admin' OR
  (location_type = 'warehouse' AND location_id IN (SELECT id FROM public.warehouses WHERE manager_id = auth.uid()))
);

-- RLS Policies for transfer_logs
CREATE POLICY "Admins can view all transfer logs" ON public.transfer_logs FOR SELECT USING (public.get_current_user_role() = 'admin');
CREATE POLICY "Users can view relevant transfer logs" ON public.transfer_logs FOR SELECT USING (
  public.get_current_user_role() = 'admin' OR
  completed_by = auth.uid() OR
  from_location_id IN (SELECT id FROM public.stores WHERE manager_id = auth.uid()) OR
  to_location_id IN (SELECT id FROM public.stores WHERE manager_id = auth.uid()) OR
  from_location_id IN (SELECT id FROM public.warehouses WHERE manager_id = auth.uid()) OR
  to_location_id IN (SELECT id FROM public.warehouses WHERE manager_id = auth.uid())
);

-- Enable realtime for all tables
ALTER TABLE public.stores REPLICA IDENTITY FULL;
ALTER TABLE public.warehouses REPLICA IDENTITY FULL;
ALTER TABLE public.inventory REPLICA IDENTITY FULL;
ALTER TABLE public.transfer_requests REPLICA IDENTITY FULL;
ALTER TABLE public.suggestions REPLICA IDENTITY FULL;
ALTER TABLE public.demand_forecasts REPLICA IDENTITY FULL;
ALTER TABLE public.transfer_logs REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.stores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.warehouses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transfer_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.suggestions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.demand_forecasts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transfer_logs;

-- Update profiles table to link with stores/warehouses
UPDATE public.profiles SET linked_store_id = NULL WHERE linked_store_id IS NOT NULL;
UPDATE public.profiles SET linked_warehouse_id = NULL WHERE linked_warehouse_id IS NOT NULL;
