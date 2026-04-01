# Unit 2: Customer Frontend - Code Generation Plan

## Unit Context

### 유닛 정보
- **유닛명**: Customer Frontend
- **범위**: 단일 React 프로젝트 내 `/table/*` 라우트 영역
- **담당 스토리**: US-01 ~ US-07 (7개, 모두 P1)

### 의존성
- **Unit 1 (Backend API)**: REST API 호출 (인증, 메뉴, 주문, 세션)
- **Unit 3 (Admin Frontend)**: 직접 의존성 없음 (동일 React 프로젝트, 라우팅 분리)
- **참고**: Backend API는 아직 미구현. API 명세 기반으로 프론트엔드 먼저 구현.

### 기술 스택
| 항목 | 기술 |
|---|---|
| React 18 + TypeScript (strict) | UI 프레임워크 |
| Vite | 빌드 도구 |
| React Router v6 | 라우팅 |
| Tailwind CSS | 스타일링 |
| Axios | HTTP 클라이언트 |
| Context API | 상태 관리 |
| Jest + React Testing Library | 테스트 |
| fast-check | Property-Based Testing |

### 코드 위치
- **Application Code**: `table-order/frontend/`
- **Documentation**: `table-order/aidlc-docs/construction/customer-frontend/code/`

---

## Code Generation Steps

### Step 1: 프로젝트 초기화 및 설정
- [ ] Vite + React + TypeScript 프로젝트 생성 (`frontend/`)
- [ ] package.json (의존성 정의)
- [ ] vite.config.ts
- [ ] tsconfig.json (strict 모드)
- [ ] tailwind.config.js + postcss.config.js
- [ ] index.html
- [ ] .env (VITE_API_URL)
- [ ] Dockerfile (multi-stage build)
- [ ] nginx.conf (SPA 라우팅)
- [ ] docker-compose.yml (프로젝트 루트)

### Step 2: 타입 정의 및 유틸리티
- [ ] `src/types/index.ts` — 도메인 엔티티 타입 (domain-entities.md 기반)
- [ ] `src/utils/format.ts` — 금액 포맷팅 (Intl.NumberFormat)
- [ ] `src/utils/storage.ts` — localStorage 헬퍼 (손상 방어 포함)
- **스토리**: 공통 기반 (모든 스토리에서 사용)

### Step 3: API 레이어
- [ ] `src/api/axios.ts` — Axios 인스턴스 + 인터셉터 (토큰 자동 첨부, 401 처리)
- [ ] `src/api/auth.ts` — 인증 API (login, validate)
- [ ] `src/api/menu.ts` — 메뉴 API (categories, menus)
- [ ] `src/api/order.ts` — 주문 API (create, list)
- [ ] `src/api/session.ts` — 세션 API (get/create session)
- **스토리**: US-01, US-02, US-03, US-04, US-06, US-07

### Step 4: Context (상태 관리)
- [ ] `src/contexts/AuthContext.tsx` — 인증 컨텍스트 (login, logout, 자동 로그인)
- [ ] `src/contexts/CartContext.tsx` — 장바구니 컨텍스트 (add, update, remove, clear + localStorage 동기화)
- **스토리**: US-01, US-02, US-05

### Step 5: 공통 컴포넌트
- [ ] `src/components/Header.tsx` — 상단 헤더 (매장명, CartBadge, 주문내역 링크)
- [ ] `src/components/CartBadge.tsx` — 장바구니 아이콘 + 수량 배지
- [ ] `src/components/AuthGuard.tsx` — 라우팅 가드 (토큰 없으면 SetupPage로)
- **스토리**: 공통 (모든 인증 페이지에서 사용)

### Step 6: 페이지 컴포넌트 — SetupPage
- [ ] `src/pages/SetupPage.tsx` — 초기 설정 및 인증 페이지
- **스토리**: US-01 (테이블 태블릿 초기 설정), US-02 (자동 로그인)

### Step 7: 페이지 컴포넌트 — MenuPage
- [ ] `src/components/CategoryNav.tsx` — 카테고리 가로 탭
- [ ] `src/components/MenuCard.tsx` — 메뉴 카드
- [ ] `src/pages/MenuPage.tsx` — 카테고리별 메뉴 조회
- **스토리**: US-03 (카테고리별 메뉴 조회), US-04 (메뉴 상세 정보)

### Step 8: 페이지 컴포넌트 — CartPage
- [ ] `src/components/CartItemRow.tsx` — 장바구니 아이템 행
- [ ] `src/pages/CartPage.tsx` — 장바구니 관리
- **스토리**: US-05 (장바구니 추가/수량 조절)

### Step 9: 페이지 컴포넌트 — OrderConfirmPage + OrderSuccessPage
- [ ] `src/components/OrderItemRow.tsx` — 주문 확인 아이템 행
- [ ] `src/pages/OrderConfirmPage.tsx` — 주문 확인 및 확정
- [ ] `src/pages/OrderSuccessPage.tsx` — 주문 성공 (카운트다운 + 리다이렉트)
- **스토리**: US-06 (주문 확정 및 생성)

### Step 10: 페이지 컴포넌트 — OrderHistoryPage
- [ ] `src/components/OrderCard.tsx` — 주문 카드
- [ ] `src/pages/OrderHistoryPage.tsx` — 세션 주문 내역 조회
- **스토리**: US-07 (현재 세션 주문 내역 조회)

### Step 11: 앱 라우팅 및 엔트리포인트
- [ ] `src/App.tsx` — 라우팅 설정 (/table/*)
- [ ] `src/main.tsx` — 엔트리포인트
- [ ] `src/index.css` — Tailwind 디렉티브

### Step 12: 문서 생성
- [ ] `aidlc-docs/construction/customer-frontend/code/code-summary.md` — 생성 코드 요약

---

## Story Traceability

| Story ID | 스토리 | 구현 Step |
|---|---|---|
| US-01 | 테이블 태블릿 초기 설정 | Step 2, 3, 4, 5, 6 |
| US-02 | 테이블 자동 로그인 | Step 2, 3, 4, 5, 6 |
| US-03 | 카테고리별 메뉴 조회 | Step 2, 3, 7 |
| US-04 | 메뉴 상세 정보 확인 | Step 2, 3, 7 |
| US-05 | 장바구니 추가/수량 조절 | Step 2, 4, 8 |
| US-06 | 주문 확정 및 생성 | Step 2, 3, 9 |
| US-07 | 현재 세션 주문 내역 조회 | Step 2, 3, 10 |

---

## 총 12 Steps
- Step 1: 프로젝트 초기화 (설정 파일, 인프라)
- Step 2~4: 기반 레이어 (타입, API, Context)
- Step 5~10: UI 컴포넌트 (공통 → 페이지별)
- Step 11: 앱 조립 (라우팅, 엔트리포인트)
- Step 12: 문서화
