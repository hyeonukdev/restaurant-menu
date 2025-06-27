-- Create sections table
CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create dishes table
CREATE TABLE dishes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  ingredients TEXT,
  image_url VARCHAR(500),
  best_seller BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create prices table
CREATE TABLE prices (
  id SERIAL PRIMARY KEY,
  dish_id INTEGER REFERENCES dishes(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create section_items table (junction table)
CREATE TABLE section_items (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
  dish_id INTEGER REFERENCES dishes(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(section_id, dish_id)
);

-- Create indexes for better performance
CREATE INDEX idx_dishes_best_seller ON dishes(best_seller);
CREATE INDEX idx_prices_dish_id ON prices(dish_id);
CREATE INDEX idx_section_items_section_id ON section_items(section_id);
CREATE INDEX idx_section_items_order_index ON section_items(order_index);

-- Insert sample data
INSERT INTO sections (name, description) VALUES
  ('Dishes', '메인 요리'),
  ('Coffee', '커피'),
  ('Beer', '맥주'),
  ('Wine', '와인'),
  ('Desserts', '디저트');

INSERT INTO dishes (name, description, ingredients, image_url, best_seller) VALUES
  ('에그인헬', '고기와 토마토, 양파와 마늘을 저온숙성 시킨 오크라식 에그인헬(빵과 함께 제공)', '고기, 토마토, 양파, 마늘', '/images/menu/menu_3.jpeg', true),
  ('파스타 카르보나라', '계란 노른자와 파마산 치즈, 후추로 만든 클래식 카르보나라', '스파게티, 계란, 파마산 치즈, 후추, 올리브유', '/images/menu/menu_1.jpeg', false),
  ('아메리카노', '깊고 진한 에스프레소의 맛', '에스프레소, 물', '/images/menu/menu_2.jpeg', false),
  ('라떼', '부드러운 우유와 에스프레소의 조화', '에스프레소, 우유', '/images/menu/menu_4.jpeg', false);

INSERT INTO prices (dish_id, name, price) VALUES
  (1, 'STANDARD', 15000),
  (2, 'STANDARD', 12000),
  (3, 'STANDARD', 4500),
  (4, 'STANDARD', 5500);

INSERT INTO section_items (section_id, dish_id, order_index) VALUES
  (1, 1, 1),
  (1, 2, 2),
  (2, 3, 1),
  (2, 4, 2);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dishes_updated_at BEFORE UPDATE ON dishes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 