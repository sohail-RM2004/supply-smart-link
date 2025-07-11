
-- First, let's properly link the current user to their store
UPDATE public.stores 
SET manager_id = '90cbbd18-98ec-433c-98c3-109623f5d3a7' 
WHERE id = '224237b2-0e16-43a4-a4cc-c9f59393ff86';

-- Add some sample inventory data for the store
INSERT INTO public.inventory (location_id, location_type, sku, product_name, category, current_stock, min_threshold, max_capacity, unit_cost) VALUES
('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'CLTH-001', 'Cotton T-Shirt', 'Clothing', 45, 20, 100, 15.99),
('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'CLTH-002', 'Denim Jeans', 'Clothing', 12, 15, 80, 49.99),
('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'ELEC-001', 'Wireless Headphones', 'Electronics', 8, 10, 50, 89.99),
('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'HOME-001', 'Coffee Mug', 'Home & Garden', 35, 25, 120, 12.50),
('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'SPRT-001', 'Basketball', 'Sports', 18, 12, 60, 24.99);

-- Add a warehouse for completeness
INSERT INTO public.warehouses (id, name, location, address, manager_id, max_capacity, temperature_controlled) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Central Warehouse', 'Mumbai', '456 Industrial Blvd, Mumbai 400001', null, 10000, false);

-- Add some warehouse inventory
INSERT INTO public.inventory (location_id, location_type, sku, product_name, category, current_stock, min_threshold, max_capacity, unit_cost) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'warehouse', 'CLTH-001', 'Cotton T-Shirt', 'Clothing', 250, 50, 500, 12.99),
('550e8400-e29b-41d4-a716-446655440000', 'warehouse', 'CLTH-002', 'Denim Jeans', 'Clothing', 180, 40, 300, 39.99),
('550e8400-e29b-41d4-a716-446655440000', 'warehouse', 'ELEC-001', 'Wireless Headphones', 'Electronics', 120, 30, 200, 79.99),
('550e8400-e29b-41d4-a716-446655440000', 'warehouse', 'HOME-001', 'Coffee Mug', 'Home & Garden', 300, 75, 500, 9.50),
('550e8400-e29b-41d4-a716-446655440000', 'warehouse', 'SPRT-001', 'Basketball', 'Sports', 95, 25, 150, 19.99);

-- Add some demand forecasts for the store
INSERT INTO public.demand_forecasts (location_id, location_type, sku, forecast_date, predicted_demand, actual_demand, confidence_score) VALUES
('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'CLTH-001', '2024-01-16', 12, 10, 0.85),
('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'CLTH-001', '2024-01-17', 15, 14, 0.82),
('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'CLTH-001', '2024-01-18', 18, null, 0.80),
('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'CLTH-001', '2024-01-19', 22, null, 0.78),
('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'CLTH-001', '2024-01-20', 25, null, 0.75),
('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'CLTH-001', '2024-01-21', 20, null, 0.77),
('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'CLTH-001', '2024-01-22', 16, null, 0.79);

-- Add some transfer requests
INSERT INTO public.transfer_requests (from_location_id, from_location_type, to_location_id, to_location_type, sku, quantity, status, priority, requested_by, expected_arrival, notes) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'warehouse', '224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'CLTH-002', 20, 'in_transit', 'high', '90cbbd18-98ec-433c-98c3-109623f5d3a7', '2024-01-17 10:00:00+00', 'Low stock replenishment'),
('550e8400-e29b-41d4-a716-446655440000', 'warehouse', '224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'ELEC-001', 15, 'approved', 'medium', '90cbbd18-98ec-433c-98c3-109623f5d3a7', '2024-01-18 14:00:00+00', 'Restocking electronics');

-- Add some AI suggestions
INSERT INTO public.suggestions (message, from_location_id, from_location_type, to_location_id, to_location_type, sku, quantity, status, priority, confidence_score, reasoning) VALUES
('Low stock alert: ELEC-001 below minimum threshold', '550e8400-e29b-41d4-a716-446655440000', 'warehouse', '224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'ELEC-001', 25, 'pending', 'high', 0.92, 'Current stock (8) is below minimum threshold (10). High demand predicted for next week.'),
('Restock recommendation for CLTH-002', '550e8400-e29b-41d4-a716-446655440000', 'warehouse', '224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'CLTH-002', 30, 'pending', 'medium', 0.78, 'Stock level is critically low (12 units). Historical data shows increased demand during this period.');
