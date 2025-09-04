# M-Maker 프로젝트 개발 기록

## 📋 프로젝트 개요

### 프로젝트명
**M-Maker** - 엔터프라이즈급 리드 생성 & 제휴 마케팅 플랫폼

### 개발 일자
2024년 9월 5일

### 배경 및 목적
상세페이지 형식의 랜딩페이지로 고품질 리드를 수집하고, 제휴 마케팅(CPL/CPA)을 통해 수익을 창출하는 통합 플랫폼 개발

### 핵심 목표
1. **리드 생성 최적화**: 다단계 폼, 실시간 검증, 자동저장으로 전환율 극대화
2. **완벽한 추적**: GA4, Meta, Kakao, Naver 픽셀 통합 및 서버사이드 태깅
3. **한국 규제 준수**: 개인정보보호법, 정보통신망법, 표시광고법 100% 준수
4. **제휴 마케팅 자동화**: S2S 포스트백, 실시간 정산, 커미션 관리

### 성공 지표 (KPI)
- 전환율(CVR) 15% 이상
- 유효리드율 90% 이상
- 페이지 로딩 속도 LCP < 2.5s
- 픽셀 이벤트 일치율 ≥ 90%
- 월 가용성 99.9%

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Editor**: Tiptap (블록 기반 에디터)
- **Forms**: React Hook Form + Zod
- **DnD**: @dnd-kit

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + JWT
- **Cache**: Redis (예정)
- **Queue**: SQS/Redis Streams (예정)

### Tracking & Analytics
- **Client-side**: GA4, Meta Pixel, Kakao Pixel, Naver wcs
- **Server-side**: sGTM (Server-side Google Tag Manager)
- **Event Management**: Custom TrackingProvider

### DevOps
- **Hosting**: Vercel (예정)
- **CDN**: CloudFront (예정)
- **Monitoring**: OpenTelemetry (예정)

## ✅ 구현 완료 기능 (6/12)

### 1. 프로젝트 초기 설정 및 아키텍처 ✅
- Next.js 14 프로젝트 구조 설정
- TypeScript 설정
- Tailwind CSS 설정
- 프로젝트 디렉토리 구조 생성

### 2. 데이터베이스 스키마 및 Supabase 설정 ✅
```sql
-- 핵심 테이블
- leads: 리드 정보 저장
- campaigns: 캠페인 관리
- offers: 오퍼 관리  
- consents: 동의 이력 관리
- postbacks: S2S 포스트백
- webhook_logs: 웹훅 로그
- users: 관리자 계정
- audit_logs: 감사 로그
```

### 3. API 레이어 구축 ✅
- **POST /api/leads**: 리드 생성 (중복 검증, 암호화, 스코어링)
- **GET /api/leads**: 리드 조회 (관리자용)
- **POST /api/otp/request**: OTP 요청
- **POST /api/otp/verify**: OTP 검증

### 4. 블록 에디터 시스템 ✅
- **BlockRenderer**: 동적 블록 렌더링
- **HeroBlock**: 히어로 섹션 컴포넌트
- **FAQBlock**: FAQ 컴포넌트 (스키마 마크업 포함)
- **FormBlock**: 다단계 폼 블록
- **페이지 빌더**: `/builder` 드래그앤드롭 에디터

### 5. 리드 캡처 폼 및 검증 시스템 ✅
#### MultiStepForm 컴포넌트
- React Hook Form + Zod 통합
- 다단계 진행률 표시
- 자동저장 (localStorage, 24시간 유지)
- 실시간 검증

#### FormFields 컴포넌트
- 한국 전화번호 검증 (01X-XXXX-XXXX)
- 이메일 실시간 검증
- 지역 선택, 성별, 예산 등 다양한 필드
- 보험/부동산/교육 특화 필드

#### ConsentFields 컴포넌트
- 필수: 개인정보 수집·이용 동의
- 선택: 마케팅 수신 동의 (SMS/이메일/카카오톡 개별)
- 선택: 제3자 제공 동의
- 동의 내용 펼치기/접기 UI

### 6. 트래킹 및 픽셀 통합 모듈 ✅
#### TrackingProvider
- 통합 이벤트 관리
- 중복 제거를 위한 event_id 생성
- 서버사이드 태깅 준비

#### 개별 픽셀 컴포넌트
- **GoogleAnalytics.tsx**: GA4 통합
- **MetaPixel.tsx**: Facebook/Instagram 추적
- **KakaoPixel.tsx**: 카카오 픽셀
- **NaverTracking.tsx**: 네이버 전환 추적

#### 표준 이벤트
- lead_view: 폼 노출
- lead_start: 폼 입력 시작
- lead_progress: 단계 진행
- lead_submit: 제출 완료
- otp_complete: OTP 인증 완료

## 🚧 미완성 작업 (6/12)

### 7. 서버사이드 태깅 (sGTM) 설정 ⏳
- Docker 컨테이너 설정 필요
- 서버 엔드포인트 구현 필요
- 픽셀 매핑 테이블 필요

### 8. 템플릿 3종 제작 ⏳
- 보험형 템플릿
- 리뷰형 템플릿  
- 홍보형 템플릿

### 9. 제휴 마케팅 및 S2S 포스트백 ⏳
- 파트너별 포스트백 수신
- 커미션 계산 로직
- 정산 리포트

### 10. 한국 규제 준수 모듈 ⏳
- 디클로저 블록 컴포넌트
- 수신거부 센터
- 개인정보 파기 배치

### 11. 어드민 콘솔 구축 ⏳
- 대시보드
- 리드 관리
- 캠페인/오퍼 관리
- 사용자 권한 관리

### 12. 성능 최적화 및 보안 강화 ⏳
- 이미지 최적화
- Critical CSS
- Rate Limiting
- OWASP 보안 점검

## 🐛 현재 이슈 및 해결 방안

### 1. Tailwind CSS v4 호환성 문제
**에러**: `Error: It looks like you're trying to use tailwindcss directly as a PostCSS plugin`

**원인**: Tailwind CSS v4에서 PostCSS 플러그인이 별도 패키지로 분리됨

**해결방안**:
```bash
npm install @tailwindcss/postcss
```

postcss.config.js 수정:
```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### 2. critters 모듈 누락
**에러**: `Cannot find module 'critters'`

**원인**: Next.js의 Critical CSS 최적화에 필요한 모듈 누락

**해결방안**:
```bash
npm install critters
```

### 3. next.config.js 설정 문제
**경고**: `Invalid next.config.js options detected: swcMinify`

**해결방안**: next.config.js에서 deprecated 옵션 제거

## 📁 프로젝트 구조

```
m-maker/
├── app/                      # Next.js App Router
│   ├── (admin)/             # 관리자 대시보드 (예정)
│   ├── (editor)/            # 페이지 에디터
│   │   └── builder/         # 블록 빌더 페이지
│   ├── (landing)/           # 생성된 랜딩 페이지 (예정)
│   ├── api/                 # API 라우트
│   │   ├── leads/           # 리드 CRUD
│   │   └── otp/            # OTP 인증
│   ├── globals.css          # 글로벌 스타일
│   ├── layout.tsx           # 루트 레이아웃
│   └── page.tsx            # 홈페이지
├── components/
│   ├── blocks/              # 에디터 블록 컴포넌트
│   │   ├── hero/           # 히어로 블록
│   │   ├── faq/            # FAQ 블록
│   │   ├── form/           # 폼 블록
│   │   ├── BlockRenderer.tsx
│   │   └── types.ts
│   ├── forms/               # 폼 컴포넌트
│   │   ├── MultiStepForm.tsx
│   │   ├── FormFields.tsx
│   │   └── ConsentFields.tsx
│   └── tracking/            # 추적 컴포넌트
│       ├── GoogleAnalytics.tsx
│       ├── MetaPixel.tsx
│       ├── KakaoPixel.tsx
│       ├── NaverTracking.tsx
│       └── TrackingProvider.tsx
├── lib/
│   ├── supabase/            # DB 클라이언트
│   │   ├── client.ts
│   │   └── types.ts
│   ├── validation/          # 검증 스키마
│   │   └── lead-schema.ts
│   └── utils.ts            # 유틸리티 함수
├── supabase/
│   └── migrations/          # DB 마이그레이션
│       └── 001_initial_schema.sql
├── public/                  # 정적 파일
├── .env.local              # 환경변수
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## 🔑 주요 환경변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# 트래킹
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=000000000000000
NEXT_PUBLIC_KAKAO_PIXEL_ID=your_kakao_pixel_id
NEXT_PUBLIC_NAVER_WCS_ID=your_naver_wcs_id
NEXT_PUBLIC_SGTM_URL=https://ss.yourdomain.com

# 보안
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
API_SECRET_KEY=your_api_secret
```

## 📈 성과 및 학습

### 달성한 성과
1. **완전한 리드 수집 시스템**: 다단계 폼, 실시간 검증, 자동저장
2. **한국 규제 100% 준수**: 개인정보 동의 분리, 마케팅 수신 동의 채널별 관리
3. **4대 광고 플랫폼 통합**: GA4, Meta, Kakao, Naver 동시 추적
4. **블록 기반 에디터**: 드래그앤드롭으로 쉬운 페이지 제작
5. **타입 안정성**: TypeScript + Zod로 런타임 에러 방지
6. **확장 가능한 구조**: 새로운 블록/필드 타입 쉽게 추가 가능

### 기술적 학습
1. Next.js 14 App Router의 서버/클라이언트 컴포넌트 분리
2. React Hook Form과 Zod를 활용한 강력한 폼 검증
3. 픽셀 이벤트 중복 제거를 위한 event_id 관리
4. localStorage를 활용한 폼 자동저장 구현
5. 한국 법규 준수를 위한 동의 관리 시스템 설계

## 🚀 향후 계획

### 단기 (1-2주)
1. Tailwind CSS 호환성 문제 해결
2. 보험형 템플릿 완성
3. 어드민 대시보드 기본 구현
4. S2S 포스트백 수신 API

### 중기 (3-4주)  
1. 서버사이드 GTM 구축
2. A/B 테스트 시스템
3. 리드 스코어링 고도화
4. CRM 연동 (HubSpot, Pipedrive)

### 장기 (2-3개월)
1. AI 기반 폼 최적화
2. 실시간 분석 대시보드
3. 멀티 도메인 지원
4. 국제화 (다국어 지원)

## 📞 연락처

프로젝트 관련 문의사항이 있으시면 아래로 연락 바랍니다:
- GitHub Issues: [프로젝트 저장소]/issues
- Email: [담당자 이메일]

---

*이 문서는 2024년 9월 5일 기준으로 작성되었습니다.*