# 테이블오더 서비스 - 컴포넌트 정의

## 아키텍처 개요
- **패턴**: Layered Architecture (Controller → Service → Repository)
- **백엔드**: Spring Boot (Java)
- **프론트엔드**: React (TypeScript) × 1 프로젝트 (라우팅으로 고객용/관리자용 분리)
- **DB 접근**: Spring Data JPA
- **API 스타일**: RESTful
- **인증**: 동일 엔드포인트, 역할(TABLE/ADMIN) 구분

---

## 1. 백엔드 컴포넌트

### 1.1 Controller 계층

| 컴포넌트 | 책임 | 관련 스토리 |
|---|---|---|
| AuthController | 인증 처리 (테이블/관리자 로그인) | US-01, US-02, US-08 |
| MenuController | 메뉴 조회 및 관리 API | US-03, US-04, US-14, US-15 |
| CartController | (클라이언트 전용 - 백엔드 없음) | US-05 |
| OrderController | 주문 생성, 조회, 상태 변경, 삭제 | US-06, US-07, US-10, US-11 |
| TableController | 테이블 관리 (세션 종료, 과거 내역) | US-01, US-12, US-13 |
| SseController | SSE 실시간 이벤트 스트림 | US-09 |

### 1.2 Service 계층

| 컴포넌트 | 책임 | 관련 스토리 |
|---|---|---|
| AuthService | 인증 로직, JWT 생성/검증, 역할 관리 | US-01, US-02, US-08 |
| MenuService | 메뉴 CRUD, 카테고리 관리, 순서 조정 | US-03, US-04, US-14, US-15 |
| OrderService | 주문 생성, 조회, 상태 변경, 삭제, 금액 계산 | US-06, US-07, US-10, US-11 |
| TableSessionService | 테이블 세션 관리, 이용 완료, 과거 내역 | US-01, US-12, US-13 |
| SseService | SSE 이벤트 발행, 연결 관리 | US-09 |

### 1.3 Repository 계층

| 컴포넌트 | 책임 |
|---|---|
| StoreRepository | 매장 정보 조회 |
| StoreUserRepository | 매장 사용자(관리자) 조회 |
| TableRepository | 테이블 정보 CRUD |
| MenuCategoryRepository | 메뉴 카테고리 CRUD |
| MenuItemRepository | 메뉴 아이템 CRUD |
| OrderRepository | 주문 CRUD |
| OrderItemRepository | 주문 항목 CRUD |
| OrderHistoryRepository | 과거 주문 이력 조회 |
| TableSessionRepository | 테이블 세션 CRUD |

### 1.4 공통 컴포넌트

| 컴포넌트 | 책임 |
|---|---|
| JwtTokenProvider | JWT 토큰 생성, 검증, 파싱 |
| SecurityConfig | Spring Security 설정, 필터 체인 |
| GlobalExceptionHandler | 전역 예외 처리 |
| DataInitializer | 시드 데이터 초기화 |

---

## 2. 프론트엔드 컴포넌트 (frontend-app - 단일 프로젝트)

라우팅 분리: `/table/*` (고객용), `/admin/*` (관리자용)

### 2.1 고객용 페이지 컴포넌트 (/table/*)

| 컴포넌트 | 책임 | 관련 스토리 |
|---|---|---|
| SetupPage | 테이블 초기 설정 (매장ID, 테이블번호, 비밀번호) | US-01 |
| MenuPage | 카테고리별 메뉴 조회 (기본 화면) | US-03, US-04 |
| CartPage | 장바구니 관리 | US-05 |
| OrderConfirmPage | 주문 최종 확인 및 확정 | US-06 |
| OrderSuccessPage | 주문 성공 (5초 후 리다이렉트) | US-06 |
| OrderHistoryPage | 현재 세션 주문 내역 조회 | US-07 |

### 2.2 관리자용 페이지 컴포넌트 (/admin/*)

| 컴포넌트 | 책임 | 관련 스토리 |
|---|---|---|
| LoginPage | 관리자 로그인 | US-08 |
| DashboardPage | 실시간 주문 대시보드 (그리드 레이아웃) | US-09, US-10 |
| OrderDetailModal | 주문 상세 보기 모달 | US-09, US-10 |
| TableManagementPage | 테이블 관리 (삭제, 세션 종료) | US-11, US-12 |
| OrderHistoryModal | 과거 주문 내역 조회 모달 | US-13 |
| MenuManagementPage | 메뉴 관리 (CRUD) | US-14, US-15 |

### 2.3 공통 컴포넌트

| 컴포넌트 | 책임 | 사용처 |
|---|---|---|
| MenuCard | 메뉴 카드 UI | 고객용 |
| CategoryNav | 카테고리 네비게이션 | 고객용 |
| CartBadge | 장바구니 아이콘 + 수량 배지 | 고객용 |
| Navigation | 하단/상단 네비게이션 바 | 고객용 |
| TableCard | 테이블별 주문 카드 (대시보드용) | 관리자용 |
| OrderStatusBadge | 주문 상태 배지 | 관리자용 |
| ConfirmDialog | 확인 팝업 (삭제, 이용 완료) | 관리자용 |
| AdminNavigation | 관리자 사이드바/네비게이션 | 관리자용 |
