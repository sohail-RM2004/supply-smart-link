
-- Insert 5 stores
INSERT INTO public.stores (id, name, location, address, max_capacity) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Downtown Fresh Market', 'Downtown', '123 Main Street, City Center', 1200),
('550e8400-e29b-41d4-a716-446655440002', 'Westside Grocery', 'West District', '456 Oak Avenue, Westside', 1000),
('550e8400-e29b-41d4-a716-446655440003', 'Northpoint Store', 'North Area', '789 Pine Road, Northpoint', 800),
('550e8400-e29b-41d4-a716-446655440004', 'Eastgate Market', 'East Side', '321 Elm Street, Eastgate', 1500),
('550e8400-e29b-41d4-a716-446655440005', 'Southtown Supermarket', 'South District', '654 Maple Drive, Southtown', 1100);

-- Insert 2 warehouses
INSERT INTO public.warehouses (id, name, location, address, max_capacity, temperature_controlled) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Central Distribution Hub', 'Industrial District', '1000 Warehouse Blvd, Industrial Zone', 15000, true),
('660e8400-e29b-41d4-a716-446655440002', 'North Regional Warehouse', 'North Industrial', '2500 Commerce Way, North Industrial Park', 12000, false);

-- Insert inventory for each store (4 items per store: mangoes, apples, bananas, oranges)
INSERT INTO public.inventory (location_id, location_type, sku, product_name, category, current_stock, min_threshold, max_capacity, unit_cost, last_updated) VALUES
-- Downtown Fresh Market inventory
('550e8400-e29b-41d4-a716-446655440001', 'store', 'MANGO-001', 'Fresh Mangoes', 'Fruits', 85, 20, 150, 2.50, '2025-01-10 14:30:00+00'),
('550e8400-e29b-41d4-a716-446655440001', 'store', 'APPLE-001', 'Red Apples', 'Fruits', 120, 30, 200, 1.80, '2025-01-10 14:30:00+00'),
('550e8400-e29b-41d4-a716-446655440001', 'store', 'BANANA-001', 'Yellow Bananas', 'Fruits', 95, 25, 180, 1.20, '2025-01-10 14:30:00+00'),
('550e8400-e29b-41d4-a716-446655440001', 'store', 'ORANGE-001', 'Navel Oranges', 'Fruits', 110, 20, 160, 2.00, '2025-01-10 14:30:00+00'),

-- Westside Grocery inventory
('550e8400-e29b-41d4-a716-446655440002', 'store', 'MANGO-001', 'Fresh Mangoes', 'Fruits', 65, 20, 120, 2.50, '2025-01-10 13:45:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'store', 'APPLE-001', 'Red Apples', 'Fruits', 140, 30, 180, 1.80, '2025-01-10 13:45:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'store', 'BANANA-001', 'Yellow Bananas', 'Fruits', 75, 25, 150, 1.20, '2025-01-10 13:45:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'store', 'ORANGE-001', 'Navel Oranges', 'Fruits', 90, 20, 140, 2.00, '2025-01-10 13:45:00+00'),

-- Northpoint Store inventory
('550e8400-e29b-41d4-a716-446655440003', 'store', 'MANGO-001', 'Fresh Mangoes', 'Fruits', 45, 15, 100, 2.50, '2025-01-10 15:20:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'store', 'APPLE-001', 'Red Apples', 'Fruits', 80, 25, 140, 1.80, '2025-01-10 15:20:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'store', 'BANANA-001', 'Yellow Bananas', 'Fruits', 60, 20, 120, 1.20, '2025-01-10 15:20:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'store', 'ORANGE-001', 'Navel Oranges', 'Fruits', 70, 15, 110, 2.00, '2025-01-10 15:20:00+00'),

-- Eastgate Market inventory
('550e8400-e29b-41d4-a716-446655440004', 'store', 'MANGO-001', 'Fresh Mangoes', 'Fruits', 100, 25, 180, 2.50, '2025-01-10 12:15:00+00'),
('550e8400-e29b-41d4-a716-446655440004', 'store', 'APPLE-001', 'Red Apples', 'Fruits', 160, 40, 250, 1.80, '2025-01-10 12:15:00+00'),
('550e8400-e29b-41d4-a716-446655440004', 'store', 'BANANA-001', 'Yellow Bananas', 'Fruits', 130, 30, 200, 1.20, '2025-01-10 12:15:00+00'),
('550e8400-e29b-41d4-a716-446655440004', 'store', 'ORANGE-001', 'Navel Oranges', 'Fruits', 145, 25, 190, 2.00, '2025-01-10 12:15:00+00'),

-- Southtown Supermarket inventory
('550e8400-e29b-41d4-a716-446655440005', 'store', 'MANGO-001', 'Fresh Mangoes', 'Fruits', 75, 20, 140, 2.50, '2025-01-10 16:00:00+00'),
('550e8400-e29b-41d4-a716-446655440005', 'store', 'APPLE-001', 'Red Apples', 'Fruits', 125, 35, 200, 1.80, '2025-01-10 16:00:00+00'),
('550e8400-e29b-41d4-a716-446655440005', 'store', 'BANANA-001', 'Yellow Bananas', 'Fruits', 85, 25, 160, 1.20, '2025-01-10 16:00:00+00'),
('550e8400-e29b-41d4-a716-446655440005', 'store', 'ORANGE-001', 'Navel Oranges', 'Fruits', 105, 20, 150, 2.00, '2025-01-10 16:00:00+00'),

-- Warehouse inventory (higher quantities)
('660e8400-e29b-41d4-a716-446655440001', 'warehouse', 'MANGO-001', 'Fresh Mangoes', 'Fruits', 2500, 500, 5000, 2.25, '2025-01-10 10:00:00+00'),
('660e8400-e29b-41d4-a716-446655440001', 'warehouse', 'APPLE-001', 'Red Apples', 'Fruits', 3200, 600, 6000, 1.60, '2025-01-10 10:00:00+00'),
('660e8400-e29b-41d4-a716-446655440001', 'warehouse', 'BANANA-001', 'Yellow Bananas', 'Fruits', 2800, 500, 5500, 1.00, '2025-01-10 10:00:00+00'),
('660e8400-e29b-41d4-a716-446655440001', 'warehouse', 'ORANGE-001', 'Navel Oranges', 'Fruits', 2100, 400, 4500, 1.75, '2025-01-10 10:00:00+00'),

('660e8400-e29b-41d4-a716-446655440002', 'warehouse', 'MANGO-001', 'Fresh Mangoes', 'Fruits', 1800, 400, 4000, 2.25, '2025-01-10 09:30:00+00'),
('660e8400-e29b-41d4-a716-446655440002', 'warehouse', 'APPLE-001', 'Red Apples', 'Fruits', 2400, 500, 5000, 1.60, '2025-01-10 09:30:00+00'),
('660e8400-e29b-41d4-a716-446655440002', 'warehouse', 'BANANA-001', 'Yellow Bananas', 'Fruits', 2200, 450, 4500, 1.00, '2025-01-10 09:30:00+00'),
('660e8400-e29b-41d4-a716-446655440002', 'warehouse', 'ORANGE-001', 'Navel Oranges', 'Fruits', 1600, 350, 3500, 1.75, '2025-01-10 09:30:00+00');

-- Insert 3 historical transfer logs (completed transfers from warehouse to stores)
INSERT INTO public.transfer_logs (id, from_location_id, from_location_type, to_location_id, to_location_type, sku, quantity, status, completed_at, notes) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'warehouse', '550e8400-e29b-41d4-a716-446655440001', 'store', 'APPLE-001', 50, 'completed', '2025-01-08 14:30:00+00', 'Regular weekly restocking - Red Apples to Downtown Fresh Market'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'warehouse', '550e8400-e29b-41d4-a716-446655440004', 'store', 'BANANA-001', 75, 'completed', '2025-01-09 11:15:00+00', 'Emergency restock - Yellow Bananas to Eastgate Market'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'warehouse', '550e8400-e29b-41d4-a716-446655440003', 'store', 'MANGO-001', 30, 'completed', '2025-01-09 16:45:00+00', 'Seasonal demand fulfillment - Fresh Mangoes to Northpoint Store');
