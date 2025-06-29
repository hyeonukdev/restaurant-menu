-- sections 테이블의 시퀀스 문제 해결

-- 1. 현재 sections 테이블의 최대 ID 확인
SELECT MAX(id) as max_id FROM sections;

-- 2. 시퀀스 정보 확인 (currval 대신 last_value 사용)
SELECT last_value, is_called FROM sections_id_seq;

-- 3. 시퀀스를 최대 ID + 1로 설정
SELECT setval('sections_id_seq', COALESCE((SELECT MAX(id) FROM sections), 0) + 1, false);

-- 4. 설정 후 시퀀스 값 재확인
SELECT last_value, is_called FROM sections_id_seq;

-- 5. 다음 값 미리보기 (실제로 증가시키지 않음)
SELECT nextval('sections_id_seq');
SELECT setval('sections_id_seq', currval('sections_id_seq') - 1);

-- 6. 최종 확인
SELECT 
  (SELECT MAX(id) FROM sections) as current_max_id,
  (SELECT last_value FROM sections_id_seq) as sequence_value,
  (SELECT is_called FROM sections_id_seq) as sequence_is_called; 