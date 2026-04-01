# 테이블오더 서비스 - Unit of Work 정의

## 개발 전략
- **유닛 수**: 3개
- **개발 순서**: 동시 개발 (API 명세 기반 병렬 진행)
- **프론트엔드**: 단일 React 프로젝트, 라우팅 분리 (/table/*, /admin/*)

---

## Unit 1: Backend API (backend)

### 범위
Spring Boot 기반 REST API 서버. 인증, 메뉴, 주문, 테이블 세션, SSE 실시간 통신 전체를 담당.

### 책임
- 인증/인가 (JWT, bcrypt, 역할 기반 접근 제어)
- 메뉴 CRUD 및 카테고리 관리
- 주문 생성, 조회, 상태 변경, 삭제
- 테이블 세션 관리 (생성, 종료, 이력)
- SSE 실시간 이벤트 스트리밍
- 시드 데이터 초기화
- 데이터 영속성 (SQLite + JPA)

### 기술 스택
| 항목 | 기술 |
|---|---|
| 언어 | Java 17+ |
| 프레임워크 | Spring Boot 3.x |
| DB 접근 | Spring Data JPA |
| 데이터베이스 | SQLite |
| 인증 | JWT (jjwt) |
| 해싱 | bcrypt (Spring Security) |
| 실시간 | SSE (SseEmitter) |
| 테스트 | JUnit 5, jqwik (PBT) |
| 빌드 | Gradle |

### 컴포넌트
- Controller: AuthController, MenuController, OrderController, TableController, SseController
- Service: AuthService, MenuService, OrderService, TableSessionService, SseService
- Repository: 9개 (Store, StoreUser, Table, MenuCategory, MenuItem, Order, OrderItem, OrderHistory, TableSession)
- 공통: JwtTokenProvider, SecurityConfig, GlobalExceptionHandler, DataInitializer

---

## Unit 2: Customer Frontend (frontend - /table/*)

### 범위
고객용 웹 UI. 단일 React 프로젝트 내 `/table/*` 라우트 영역.

### 책임
- 테이블 태블릿 초기 설정 및 자동 로그인
- 카테고리별 메뉴 조회 및 탐색
- 장바구니 관리 (localStorage)
- 주문 생성 및 확인
- 현재 세션 주문 내역 조회

### 기술 스택
| 항목 | 기술 |
|---|---|
| 언어 | TypeScript |
| 프레임워크 | React 18+ |
| 상태 관리 | Context API + useReducer |
| HTTP 클라이언트 | Axios |
| 라우팅 | React Router |
| 로컬 저장 | localStorage (장바구니, 인증 토큰) |
| 빌드 | Vite |

### 페이지 컴포넌트
- SetupPage, MenuPage, CartPage, OrderConfirmPage, OrderSuccessPage, OrderHistoryPage

### 공통 컴포넌트
- MenuCard, CategoryNav, CartBadge, Navigation

---

## Unit 3: Admin Frontend (frontend - /admin/*)

### 범위
관리자용 웹 UI. 단일 React 프로젝트 내 `/admin/*` 라우트 영역.

### 책임
- 관리자 로그인
- 실시간 주문 대시보드 (SSE 구독)
- 주문 상태 변경
- 테이블 관리 (주문 삭제, 이용 완료, 과거 내역)
- 메뉴 관리 (CRUD)

### 기술 스택
| 항목 | 기술 |
|---|---|
| 언어 | TypeScript |
| 프레임워크 | React 18+ |
| 상태 관리 | Context API + useReducer |
| HTTP 클라이언트 | Axios |
| 실시간 | EventSource (SSE) |
| 라우팅 | React Router |
| 빌드 | Vite (Unit 2와 동일 프로젝트) |

### 페이지 컴포넌트
- LoginPage, DashboardPage, TableManagementPage, MenuManagementPage

### 모달 컴포넌트
- OrderDetailModal, OrderHistoryModal

### 공통 컴포넌트
- TableCard, OrderStatusBadge, ConfirmDialog, AdminNavigation

---

## 코드 조직 구조

```
table-order/
+-- backend/                    # Unit 1: Backend API
|   +-- src/main/java/
|   +-- src/main/resources/
|   +-- src/test/java/
|   +-- build.gradle
|   +-- Dockerfile
+-- frontend/                   # Unit 2 + Unit 3: React SPA
|   +-- src/
|   |   +-- table/              # Unit 2: Customer pages
|   |   +-- admin/              # Unit 3: Admin pages
|   |   +-- shared/             # 공유 유틸, API 클라이언트, 타입
|   |   +-- App.tsx
|   |   +-- main.tsx
|   +-- package.json
|   +-- Dockerfile
+-- docker-compose.yml
+-- aidlc-docs/
+-- requirements/
```

### 공유 영역 (frontend/src/shared/)
Unit 2와 Unit 3이 공유하는 코드:
- API 클라이언트 (Axios 인스턴스, 인터셉터)
- 타입 정의 (DTO 타입)
- 인증 유틸리티 (토큰 저장/조회)
- 공통 UI 컴포넌트 (있을 경우)
