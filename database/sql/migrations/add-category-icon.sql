-- 카테고리(sections) 테이블에 아이콘 필드 추가 마이그레이션

-- 1. icon 컬럼 추가 (아이콘 이름 저장) - 이미 존재하면 스킵
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='sections' AND column_name='icon') THEN
        ALTER TABLE sections ADD COLUMN icon VARCHAR(50) DEFAULT 'IconBread';
    END IF;
END $$;

-- 2. display_order 컬럼 추가 (카테고리 순서 관리) - 이미 존재하면 스킵
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='sections' AND column_name='display_order') THEN
        ALTER TABLE sections ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- 3. 기존 데이터에 기본값 설정
UPDATE sections 
SET icon = COALESCE(icon, 'IconBread'), 
    display_order = COALESCE(display_order, id);

-- 4. 일반적인 카테고리 아이콘 예시 업데이트 (실제 카테고리에 맞게 수정)
-- 예: 애피타이저, 메인, 디저트, 음료 등
UPDATE sections SET icon = 'IconCoffee' WHERE name ILIKE '%커피%' OR name ILIKE '%coffee%';
UPDATE sections SET icon = 'IconBeer' WHERE name ILIKE '%맥주%' OR name ILIKE '%beer%';
UPDATE sections SET icon = 'IconGlassFull' WHERE name ILIKE '%와인%' OR name ILIKE '%wine%' OR name ILIKE '%음료%' OR name ILIKE '%drink%' OR name ILIKE '%beverage%';
UPDATE sections SET icon = 'IconIceCream2' WHERE name ILIKE '%디저트%' OR name ILIKE '%dessert%' OR name ILIKE '%sweet%';
UPDATE sections SET icon = 'IconMeat' WHERE name ILIKE '%고기%' OR name ILIKE '%meat%' OR name ILIKE '%스테이크%' OR name ILIKE '%steak%';
UPDATE sections SET icon = 'IconFish' WHERE name ILIKE '%해산물%' OR name ILIKE '%seafood%' OR name ILIKE '%생선%' OR name ILIKE '%fish%';
UPDATE sections SET icon = 'IconSalad' WHERE name ILIKE '%샐러드%' OR name ILIKE '%salad%' OR name ILIKE '%채소%';
UPDATE sections SET icon = 'IconChefHat' WHERE name ILIKE '%특선%' OR name ILIKE '%special%' OR name ILIKE '%추천%' OR name ILIKE '%시그니처%' OR name ILIKE '%signature%';
UPDATE sections SET icon = 'IconPizza' WHERE name ILIKE '%피자%' OR name ILIKE '%pizza%';
UPDATE sections SET icon = 'IconSoup' WHERE name ILIKE '%수프%' OR name ILIKE '%soup%' OR name ILIKE '%국물%';

-- 5. 결과 확인
SELECT id, name, description, icon, display_order, created_at 
FROM sections 
ORDER BY display_order; 