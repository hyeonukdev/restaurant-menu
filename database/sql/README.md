# SQL 스크립트 모음

이 폴더는 레스토랑 메뉴 프로젝트의 데이터베이스 관련 SQL 스크립트들을 포함합니다.

## 📁 폴더 구조

```
database/sql/
├── README.md
├── schemas/           # 데이터베이스 스키마 파일들
├── migrations/        # 데이터 마이그레이션 스크립트들
├── fixes/            # 문제 해결용 스크립트들
└── security/         # 보안 설정 스크립트들
```

### 🏗️ schemas/ - 스키마 파일

- **`supabase-restaurant-schema.sql`** - 레스토랑 정보와 인트로 테이블 스키마
- **`supabase-schema.sql`** - 메뉴 관련 테이블 스키마 (sections, dishes, prices 등)
- **`supabase-schema-simplified.sql`** - 단순화된 스키마

### 🔄 migrations/ - 마이그레이션 파일

- **`migrate-to-single-price.sql`** - 가격 테이블을 단일 가격으로 마이그레이션
- **`migrate-prices-simplify.sql`** - 가격 구조 단순화 마이그레이션
- **`intro-simplification.sql`** - intro_type 필드 단순화 (text, highlight만 사용)

### 🔧 fixes/ - 수정 스크립트

- **`fix-sequence.sql`** - 시퀀스 문제 해결
- **`fix-sequence-simple.sql`** - 단순한 시퀀스 수정

### 🔐 security/ - 보안 설정

- **`supabase-rls-update.sql`** - Row Level Security (RLS) 정책 설정

## 🚀 사용법

### 1. 초기 설정

```sql
-- 1. 메뉴 테이블 생성
\i schemas/supabase-schema.sql

-- 2. 레스토랑 정보 테이블 생성
\i schemas/supabase-restaurant-schema.sql

-- 3. RLS 정책 설정
\i security/supabase-rls-update.sql
```

### 2. 마이그레이션 실행

```sql
-- intro 타입 단순화
\i migrations/intro-simplification.sql

-- 가격 구조 단순화
\i migrations/migrate-prices-simplify.sql
```

### 3. 문제 해결

```sql
-- 시퀀스 문제가 있을 경우
\i fixes/fix-sequence-simple.sql
```

## ⚠️ 주의사항

1. **백업 필수**: 마이그레이션 실행 전 반드시 데이터베이스 백업
2. **순서 중요**: 스키마 파일을 먼저 실행한 후 마이그레이션 실행
3. **테스트 환경**: 프로덕션 환경 적용 전 테스트 환경에서 먼저 테스트
4. **권한 확인**: RLS 정책 적용 후 API 접근 권한 확인

## 📋 테이블 구조

### 레스토랑 정보

- `restaurant_info` - 레스토랑 기본 정보 (이름, 설명, 주소, 연락처, 영업시간, 이미지 등)
- `restaurant_intros` - 인트로 텍스트 관리 (제목, 내용, 순서, 타입, 활성화 상태)

### 메뉴 관리

- `sections` - 메뉴 섹션 (커피, 음식, 맥주, 와인 등)
- `dishes` - 요리/음료 정보 (이름, 설명, 재료, 이미지, 베스트셀러 여부)
- `prices` - 가격 정보 (요리별 가격)
- `section_items` - 섹션-요리 연결 테이블 (순서 관리)

## 🔗 관련 파일

- **API**: `/src/pages/api/` - 데이터베이스 연동 API
- **타입 정의**: `/src/lib/supabase.ts` - TypeScript 타입 정의
- **관리자 페이지**: `/src/pages/admin/` - 데이터 관리 인터페이스
- **홈페이지**: `/src/pages/home.tsx` - 데이터 표시 페이지

## 📝 개발 노트

이 SQL 스크립트들은 프로젝트 개발 과정에서 데이터베이스 구조 변경과 최적화를 위해 작성되었습니다. 각 파일은 특정 목적을 가지고 있으며, 순서대로 실행해야 합니다.
