-- intro_type 단순화 SQL 업데이트 쿼리
-- 기존: 'text', 'highlight', 'menu', 'slogan' 
-- 변경: 'text', 'highlight'

-- 1. 기존 데이터 백업 (선택사항)
-- CREATE TABLE restaurant_intros_backup AS SELECT * FROM restaurant_intros;

-- 2. intro_type 값 단순화
-- 'menu'와 'slogan' 타입을 적절히 분류
UPDATE restaurant_intros 
SET intro_type = CASE 
  WHEN intro_type = 'highlight' THEN 'highlight'
  WHEN intro_type = 'menu' AND (title IS NOT NULL AND title != '') THEN 'highlight'  -- 메뉴 제목이 있으면 강조
  WHEN intro_type = 'slogan' THEN 'highlight'  -- 슬로건은 강조로 변경
  ELSE 'text'  -- 나머지는 모두 일반 텍스트
END;

-- 3. 결과 확인
SELECT id, title, content, intro_type, display_order 
FROM restaurant_intros 
ORDER BY display_order;

-- 4. intro_type 제약조건 업데이트 (선택사항)
-- ALTER TABLE restaurant_intros 
-- ADD CONSTRAINT check_intro_type 
-- CHECK (intro_type IN ('text', 'highlight')); 