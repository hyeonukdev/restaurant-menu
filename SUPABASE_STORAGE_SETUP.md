# Supabase Storage 설정 가이드

## 1. Storage 버킷 생성

### Supabase Dashboard에서 설정

1. **Supabase Dashboard** → **Storage** 메뉴로 이동
2. **New Bucket** 버튼 클릭
3. 다음 설정으로 버킷 생성:
   - **Name**: `menu-images`
   - **Public**: ✅ 체크 (이미지 공개 접근 허용)
   - **File size limit**: `5MB` (메뉴 이미지용)

## 2. Storage 정책 설정

### SQL Editor에서 실행할 정책

```sql
-- 공개 읽기 정책 (모든 사용자가 이미지 조회 가능)
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'menu-images');

-- 관리자 업로드 정책 (선택사항 - 인증 필요시)
CREATE POLICY "Admin Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'menu-images');

-- 관리자 삭제 정책 (선택사항 - 인증 필요시)
CREATE POLICY "Admin Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'menu-images');
```

## 3. 환경 변수 확인

`.env.local` 파일에 다음이 설정되어 있는지 확인:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. 테스트

### Storage 연결 테스트 API

```bash
# Storage 연결 테스트
curl -X GET "http://localhost:3000/api/test-storage"
```

## 5. 사용법

### 이미지 업로드

- **EditDishModal**에서 이미지 업로드 버튼 클릭
- 파일 선택 (PNG, JPG, GIF, 최대 5MB)
- 자동으로 Supabase Storage에 업로드
- 공개 URL이 생성되어 메뉴에 저장

### 이미지 삭제

- 이미지 우상단의 삭제 버튼 클릭
- Storage에서도 자동 삭제됨

## 6. 주의사항

- **파일 크기**: 5MB 제한
- **파일 형식**: 이미지 파일만 (PNG, JPG, GIF)
- **중복 방지**: 타임스탬프 기반 파일명 생성
- **공개 접근**: 모든 이미지는 공개 URL로 접근 가능
