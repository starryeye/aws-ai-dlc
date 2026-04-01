# 테이블오더 서비스 - Application Design 통합 문서

---

## 1. 아키텍처 결정 사항

| 항목 | 결정 | 근거 |
|---|---|---|
| 백엔드 패턴 | Layered Architecture | Controller → Service → Repository 전통적 계층형 |
| 프론트엔드 구조 | 단일 React 프로젝트 | 라우팅으로 고객용(/table/*) / 관리자용(/admin/*) 분리 |
| API 스타일 | RESTful | 리소스 기반 URL, HTTP 메서드 활용 |
| 인증 체계 | 통합 엔드포인트 + 역할 구분 | TABLE / ADMIN 역할로 분리 |
| DB 접근 | Spring Data JPA | ORM 기반, 엔티티 매핑 |
| 실시간 통신 | SSE (Server-Sent Events) | 서버 → 관리자 단방향 스트림 |

---

## 2. 시스템 구성

```
+---------------------------------------------------+
|                   Docker Compose                   |
|                                                    |
|  +------------------+  +------------------------+  |
|  |  frontend-app    |  |  Spring Boot API       |  |
|  |  (React SPA)     |  |  + SQLite              |  |
|  |  /table/* (고객)  |  |                        |  |
|  |  /admin/* (관리)  |  |                        |  |
|  +------------------+  +------------------------+  |
|       |                       ^                    |
|       |   HTTP/REST + SSE     |                    |
|       +-----------------------+                    |
+---------------------------------------------------+
```

---

## 3. 컴포넌트 요약

### 백엔드 (Spring Boot)
- **Controller (5개)**: Auth, Menu, Order, Table, Sse
- **Service (5개)**: Auth, Menu, Order, TableSession, Sse
- **Repository (9개)**: Store, StoreUser, Table, MenuCategory, MenuItem, Order, OrderItem, OrderHistory, TableSession
- **공통 (4개)**: JwtTokenProvider, SecurityConfig, GlobalExceptionHandler, DataInitializer

### 프론트엔드 (단일 React SPA - 라우팅 분리)
- **고객용 페이지 (/table/*)**: SetupPage, MenuPage, CartPage, OrderConfirmPage, OrderSuccessPage, OrderHistoryPage (6개)
- **관리자용 페이지 (/admin/*)**: LoginPage, DashboardPage, TableManagementPage, MenuManagementPage (4개 + 2 모달)
- **공통 컴포넌트**: MenuCard, CategoryNav, CartBadge, Navigation, TableCard, OrderStatusBadge, ConfirmDialog, AdminNavigation (8개)

---

## 4. 핵심 서비스 오케스트레이션

### 주문 생성
OrderController → OrderService → TableSessionService(세션) + OrderRepository(저장) + SseService(알림)

### 테이블 이용 완료
TableController → TableSessionService → OrderRepository(조회) + OrderHistoryRepository(이력) + SseService(갱신)

### 실시간 모니터링
SseController → SseService(구독) ← OrderService/TableSessionService(이벤트 발행)

---

## 5. API 엔드포인트 요약

| 영역 | 엔드포인트 수 | 접근 권한 |
|---|---|---|
| 인증 | 2 | PUBLIC |
| 메뉴 조회 | 3 | TABLE, ADMIN |
| 메뉴 관리 | 4 | ADMIN |
| 주문 | 5 | TABLE(생성/조회), ADMIN(전체) |
| 테이블 | 4 | ADMIN |
| SSE | 1 | ADMIN |
| **합계** | **19** | |

---

## 상세 문서 참조
- 컴포넌트 정의: `components.md`
- 메서드 시그니처: `component-methods.md`
- 서비스 설계: `services.md`
- 의존성 관계: `component-dependency.md`
