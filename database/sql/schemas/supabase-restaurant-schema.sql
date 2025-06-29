-- Restaurant Info 테이블 생성
CREATE TABLE IF NOT EXISTS restaurant_info (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  address_street VARCHAR(255) NOT NULL,
  address_city VARCHAR(100) NOT NULL,
  address_state VARCHAR(100) NOT NULL,
  address_postal_code VARCHAR(20) NOT NULL,
  address_country VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  contact_instagram VARCHAR(100) NOT NULL,
  business_hours_weekday_open VARCHAR(20) NOT NULL,
  business_hours_weekday_last_order VARCHAR(20) NOT NULL,
  business_hours_weekday_close VARCHAR(20) NOT NULL,
  business_hours_weekend_open VARCHAR(20) NOT NULL,
  business_hours_weekend_last_order VARCHAR(20) NOT NULL,
  business_hours_weekend_close VARCHAR(20) NOT NULL,
  mobile_business_hours VARCHAR(255) NOT NULL,
  images_og_image VARCHAR(500) NOT NULL,
  images_home_layout_image VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant Intros 테이블 생성 (개선된 구조)
CREATE TABLE IF NOT EXISTS restaurant_intros (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  intro_type VARCHAR(50) DEFAULT 'text', -- 'text', 'highlight', 'menu', 'slogan' 등
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 데이터 삽입 (restaurant_info)
INSERT INTO restaurant_info (
  name,
  description,
  address_street,
  address_city,
  address_state,
  address_postal_code,
  address_country,
  contact_phone,
  contact_instagram,
  business_hours_weekday_open,
  business_hours_weekday_last_order,
  business_hours_weekday_close,
  business_hours_weekend_open,
  business_hours_weekend_last_order,
  business_hours_weekend_close,
  mobile_business_hours,
  images_og_image,
  images_home_layout_image
) VALUES (
  'Aukra',
  '양재천 최고의 뷰맛집! 수제 오픈샌드위치와 커피, 그리고 와인의 올데이 브런치 카페입니다.',
  '서울 서초구 양재천로 97',
  '서울',
  '서울특별시',
  '12345',
  '대한민국',
  '050-71378-8186',
  '@aukra.yangjae',
  '10:00 am',
  '6:00 pm',
  '7:00 pm',
  '10:00 am',
  '9:00 pm',
  '10:00 pm',
  '운영시간: 10:00~19:00(평일), 10:00~22:00(주말)',
  '/images/og-image.png',
  '/images/home-layout.png'
) ON CONFLICT DO NOTHING;

-- 기본 데이터 삽입 (restaurant_intros) - 개선된 구조
INSERT INTO restaurant_intros (title, content, display_order, intro_type) VALUES
  ('양재천 최고의 뷰맛집!', '', 1, 'highlight'),
  ('', '낮에는 커피, 저녁에는 한 잔의 여유', 2, 'text'),
  ('', '오크라는 브런치와 커피를 사랑하는 분들을 위한 공간이자,\n북유럽의 여유로운 하루처럼 낮에도 맥주와 와인을 즐길 수 있는\n 복합문화공간으로 확장하고 있습니다.', 3, 'text'),
  ('인기 브런치 메뉴는 그대로!', '<트러플 머쉬룸 샌드위치> \n <선드라이드 바질 샌드위치>', 4, 'menu'),
  ('이젠 한 낮에도 맥주와 와인을 자유롭게', '<산책 후, 시원한 맥주 한 잔> \n <여유로운 오후, 와인 한 모금>', 5, 'menu'),
  ('', '당신의 하루가 머무는 곳, \n 언제 찾아도 편안한 오크라에서\n 커피도 좋고, 술도 좋은 시간을 즐겨보세요.', 6, 'text'),
  ('', '낮술? 아니죠,\n 낮의 여유입니다.', 7, 'slogan'),
  ('', '양재천 옆, 오크라 드림', 8, 'slogan')
ON CONFLICT DO NOTHING;

-- RLS (Row Level Security) 설정
ALTER TABLE restaurant_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_intros ENABLE ROW LEVEL SECURITY;

-- 모든 사용자에게 모든 권한 부여 (CRUD 작업 가능)
CREATE POLICY "Allow all operations on restaurant_info" ON restaurant_info
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on restaurant_intros" ON restaurant_intros
  FOR ALL USING (true) WITH CHECK (true);

-- 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_restaurant_info_updated_at 
  BEFORE UPDATE ON restaurant_info 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_intros_updated_at 
  BEFORE UPDATE ON restaurant_intros 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_restaurant_intros_display_order ON restaurant_intros(display_order);
CREATE INDEX IF NOT EXISTS idx_restaurant_intros_active ON restaurant_intros(is_active);
CREATE INDEX IF NOT EXISTS idx_restaurant_intros_type ON restaurant_intros(intro_type); 