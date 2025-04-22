-- Create product table
CREATE TABLE IF NOT EXISTS product (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  brand VARCHAR(50),
  category VARCHAR(100),
  product_link VARCHAR(255) NOT NULL,
  product_description TEXT[],
  tags VARCHAR(50)[],
  current_price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  price_range DECIMAL(10, 2)[],
  images VARCHAR(255)[],
  date_added TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



-- Add function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to automatically update the updated_at column
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON product
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();