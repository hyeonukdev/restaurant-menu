-- 텍스트 정렬 옵션 추가 마이그레이션
-- restaurant_intros 테이블에 title_align과 content_align 컬럼 추가

-- 1. title_align 컬럼 추가 (제목 정렬)
ALTER TABLE restaurant_intros 
ADD COLUMN title_align VARCHAR(10) DEFAULT 'left' CHECK (title_align IN ('left', 'center', 'right'));

-- 2. content_align 컬럼 추가 (내용 정렬)
ALTER TABLE restaurant_intros 
ADD COLUMN content_align VARCHAR(10) DEFAULT 'left' CHECK (content_align IN ('left', 'center', 'right'));

-- 3. 기존 데이터에 기본값 설정
UPDATE restaurant_intros 
SET title_align = 'left', content_align = 'left' 
WHERE title_align IS NULL OR content_align IS NULL;

-- 4. 결과 확인
SELECT id, title, content, title_align, content_align, intro_type, display_order 
FROM restaurant_intros 
ORDER BY display_order; 