# Vercel 배포 가이드

## 환경 변수 설정

Vercel에서 이 프로젝트를 배포하기 전에 다음 환경 변수들을 설정해야 합니다:

### 1. Vercel 대시보드에서 환경 변수 설정

1. Vercel 대시보드에서 프로젝트로 이동
2. Settings > Environment Variables 메뉴로 이동
3. 다음 환경 변수들을 추가:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_OG_IMAGE_URL=your_og_image_url (선택사항)
```

### 2. 환경 변수 값 찾기

#### Supabase URL과 Anon Key 찾기:

1. Supabase 대시보드에서 프로젝트로 이동
2. Settings > API 메뉴로 이동
3. Project URL과 anon public key를 복사

### 3. 환경 변수 설정 후

환경 변수를 설정한 후:

1. Vercel에서 프로젝트를 다시 배포
2. 또는 GitHub에 푸시하면 자동으로 재배포됨

### 4. 로컬 개발 환경

로컬에서 개발할 때는 `.env.local` 파일을 생성하고 같은 환경 변수들을 설정:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_OG_IMAGE_URL=your_og_image_url
```

### 5. 문제 해결

만약 여전히 환경 변수 오류가 발생한다면:

1. Vercel 대시보드에서 환경 변수가 제대로 설정되었는지 확인
2. 프로젝트를 다시 배포
3. 브라우저 캐시를 클리어
4. Vercel 로그에서 오류 메시지 확인
