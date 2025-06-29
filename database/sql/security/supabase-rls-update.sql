-- 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "Allow public read access to restaurant_info" ON restaurant_info;
DROP POLICY IF EXISTS "Allow public read access to restaurant_intros" ON restaurant_intros;
DROP POLICY IF EXISTS "Allow authenticated users to update restaurant_info" ON restaurant_info;
DROP POLICY IF EXISTS "Allow authenticated users to insert restaurant_info" ON restaurant_info;
DROP POLICY IF EXISTS "Allow authenticated users to manage restaurant_intros" ON restaurant_intros;

-- 모든 사용자에게 모든 권한 부여 (CRUD 작업 가능)
CREATE POLICY "Allow all operations on restaurant_info" ON restaurant_info
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on restaurant_intros" ON restaurant_intros
  FOR ALL USING (true) WITH CHECK (true);

-- 정책이 제대로 적용되었는지 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('restaurant_info', 'restaurant_intros'); 