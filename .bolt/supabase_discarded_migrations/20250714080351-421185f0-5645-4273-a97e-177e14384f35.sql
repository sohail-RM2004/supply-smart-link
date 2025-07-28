-- Add fruit inventory to the store manager's store (Walmart Store A)
INSERT INTO inventory (location_id, location_type, sku, product_name, category, current_stock, min_threshold, max_capacity, unit_cost)
VALUES 
  ('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'APPLE-001', 'Red Apples', 'Fruits', 150, 30, 200, 1.80),
  ('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'MANGO-001', 'Fresh Mangoes', 'Fruits', 25, 20, 150, 2.50),
  ('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'BANANA-001', 'Yellow Bananas', 'Fruits', 85, 25, 180, 1.20),
  ('224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'ORANGE-001', 'Navel Oranges', 'Fruits', 110, 20, 160, 2.00);

-- Add fruit-related suggestions for the store manager's store
INSERT INTO suggestions (from_location_id, from_location_type, to_location_id, to_location_type, sku, quantity, message, priority, status, reasoning, confidence_score)
VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', 'warehouse', '224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'MANGO-001', 40, 'Low stock alert: Fresh Mangoes below minimum threshold', 'high', 'pending', 'Current stock (25) is below minimum threshold (20). High demand expected for weekend.', 0.88),
  ('660e8400-e29b-41d4-a716-446655440001', 'warehouse', '224237b2-0e16-43a4-a4cc-c9f59393ff86', 'store', 'APPLE-001', 50, 'Restock recommendation for Red Apples', 'medium', 'pending', 'Stock levels are good but seasonal demand increase expected.', 0.75);