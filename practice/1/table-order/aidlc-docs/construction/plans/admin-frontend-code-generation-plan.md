# Unit 3: Admin Frontend - Code Generation 계획

## 유닛 컨텍스트
- **유닛**: Unit 3 - Admin Frontend (/admin/*)
- **담당 스토리**: US-08 ~ US-15
- **코드 위치**: `frontend/src/admin/` (워크스페이스 루트 기준)
- **공유 코드**: `frontend/src/shared/`
- **기술**: React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3 + Axios + fast-check

## 의존성
- Unit 1 (Backend API): REST API + SSE 엔드포인트 (동시 개발, API 명세 기반)
- Unit 2 (Customer Frontend): 공유 코드 (shared/api, shared/types, shared/auth)

---

## 생성 단계

### Step 1: 프로젝트 구조 셋업
- [x] frontend/ 프로젝트 초기화 (Vite + React + TypeScript)
- [x] package.json 의존성 설정
- [x] tsconfig.json 설정 (strict: true)
- [x] vite.config.ts 설정 (프록시, 코드 스플리팅)
- [x] tailwind.config.js 설정
- [x] ESLint + Prettier 설정
- [x] 디렉토리 구조 생성

### Step 2: 공유 코드 생성 (shared/)
- [x] shared/types/ - DTO 타입 정의 (Request/Response)
- [x] shared/api/client.ts - Axios 인스턴스 + 인터셉터
- [x] shared/auth/authUtils.ts - 토큰 저장/조회/삭제 유틸리티

### Step 3: 인증 컨텍스트 및 라우팅
- [x] admin/contexts/AuthContext.tsx - 인증 상태 관리 (reducer)
- [x] admin/components/ProtectedRoute.tsx - 인증 가드
- [x] App.tsx - 라우터 설정 (/admin/*)
- [x] main.tsx - 엔트리 포인트
- [x] **스토리**: US-08 (관리자 로그인)

### Step 4: 레이아웃 및 네비게이션
- [x] admin/components/AdminLayout.tsx - 사이드바 + 콘텐츠 영역
- [x] admin/components/AdminNavigation.tsx - 좌측 사이드바 네비게이션
- [x] admin/components/ConnectionStatus.tsx - SSE 연결 상태 인디케이터

### Step 5: 로그인 페이지
- [x] admin/pages/LoginPage.tsx - 관리자 로그인 폼
- [x] **스토리**: US-08

### Step 6: 주문 컨텍스트 및 SSE 훅
- [x] admin/contexts/OrderContext.tsx - 주문 상태 관리 (reducer)
- [x] admin/hooks/useSse.ts - SSE 연결/재연결/이벤트 처리 훅
- [x] **스토리**: US-09

### Step 7: 대시보드 페이지
- [x] admin/pages/DashboardPage.tsx - 실시간 주문 대시보드
- [x] admin/components/TableCardGrid.tsx - 반응형 그리드
- [x] admin/components/TableCard.tsx - 테이블별 카드
- [x] admin/components/OrderStatusBadge.tsx - 상태 배지
- [x] admin/components/OrderDetailModal.tsx - 주문 상세 모달
- [x] admin/components/StatusDropdown.tsx - 상태 변경 드롭다운
- [x] **스토리**: US-09, US-10

### Step 8: 공통 컴포넌트
- [x] admin/components/ConfirmDialog.tsx - 확인 팝업
- [x] admin/components/Spinner.tsx - 로딩 스피너
- [x] Toast - react-hot-toast 라이브러리 사용 (별도 파일 불필요)

### Step 9: 테이블 관리 페이지
- [x] admin/pages/TableManagementPage.tsx - 테이블 관리
- [x] admin/components/OrderHistoryModal.tsx - 과거 내역 모달
- [x] admin/components/DateFilter.tsx - 날짜 필터
- [x] **스토리**: US-11, US-12, US-13

### Step 10: 메뉴 컨텍스트
- [x] admin/contexts/MenuContext.tsx - 메뉴 상태 관리 (reducer)

### Step 11: 메뉴 관리 페이지
- [x] admin/pages/MenuManagementPage.tsx - 메뉴 관리
- [x] admin/components/CategoryTabs.tsx - 카테고리 탭
- [x] MenuItemList - MenuManagementPage 내 테이블로 구현
- [x] admin/components/MenuFormModal.tsx - 메뉴 등록/수정 모달
- [x] **스토리**: US-14, US-15

### Step 12: API 서비스 레이어
- [x] admin/services/authApi.ts - 인증 API 호출
- [x] admin/services/orderApi.ts - 주문 API 호출
- [x] admin/services/tableApi.ts - 테이블 API 호출
- [x] admin/services/menuApi.ts - 메뉴 API 호출

### Step 13: PBT 테스트 (Property-Based Testing)
- [x] admin/__tests__/orderReducer.pbt.test.ts - OrderContext reducer PBT
- [x] admin/__tests__/menuReducer.pbt.test.ts - MenuContext reducer PBT
- [x] admin/__tests__/validation.pbt.test.ts - 메뉴 폼 검증 PBT
- [x] DTO round-trip PBT - 프론트엔드 전용 타입이므로 N/A (백엔드 직렬화 테스트에서 커버)
- [x] **PBT 규칙**: PBT-02 ~ PBT-08, PBT-10

### Step 14: 단위 테스트 (Example-Based)
- [x] admin/__tests__/orderReducer.test.ts - OrderContext reducer 단위 테스트
- [x] admin/__tests__/menuReducer.test.ts - MenuContext reducer 단위 테스트
- [x] admin/__tests__/authReducer.test.ts - AuthContext reducer 단위 테스트
- [x] **PBT 규칙**: PBT-10 (PBT와 example-based 보완)

### Step 15: Dockerfile 및 Nginx 설정
- [x] frontend/Dockerfile (multi-stage build)
- [x] frontend/nginx.conf (SPA 라우팅 + API 프록시)

### Step 16: 코드 생성 요약 문서
- [x] aidlc-docs/construction/admin-frontend/code/code-summary.md

---

## 스토리 추적

| Story | Step | 상태 |
|---|---|---|
| US-08 (관리자 로그인) | Step 3, 5 | [x] |
| US-09 (실시간 대시보드) | Step 6, 7 | [x] |
| US-10 (주문 상태 변경) | Step 7 | [x] |
| US-11 (주문 삭제) | Step 9 | [x] |
| US-12 (테이블 이용 완료) | Step 9 | [x] |
| US-13 (과거 주문 내역) | Step 9 | [x] |
| US-14 (메뉴 조회) | Step 10, 11 | [x] |
| US-15 (메뉴 등록/수정/삭제) | Step 11 | [x] |
