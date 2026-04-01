# 테이블오더 서비스 - 컴포넌트 의존성

---

## 의존성 매트릭스 (백엔드)

| 컴포넌트 | 의존 대상 |
|---|---|
| AuthController | AuthService |
| MenuController | MenuService |
| OrderController | OrderService |
| TableController | TableSessionService |
| SseController | SseService |
| AuthService | StoreRepository, StoreUserRepository, TableRepository, JwtTokenProvider |
| MenuService | MenuItemRepository, MenuCategoryRepository |
| OrderService | OrderRepository, OrderItemRepository, TableSessionService, SseService |
| TableSessionService | TableSessionRepository, OrderRepository, OrderHistoryRepository, SseService |
| SseService | (독립 - ConcurrentHashMap으로 Emitter 관리) |

---

## 통신 패턴

### 클라이언트 → 서버
```
+---------------+     HTTP/REST     +------------------+
| frontend-app  | ----------------> | Spring Boot API  |
| (React SPA)   |     + SSE         +------------------+
| /table/*      |
| /admin/*      |
+---------------+
```

### 서버 → 클라이언트 (실시간)
```
+------------------+       SSE        +---------------+
| Spring Boot API  | ---------------> | frontend-app  |
| (SseService)     |  (단방향 스트림)  | (/admin/*)    |
+------------------+                  +---------------+
```

### 내부 서비스 의존성
```
+----------------+     +-------------------+
| AuthController | --> | AuthService       |
+----------------+     +-------------------+
                              |
                              v
                       +-------------------+
                       | StoreRepository   |
                       | StoreUserRepo     |
                       | TableRepository   |
                       | JwtTokenProvider  |
                       +-------------------+

+----------------+     +-------------------+
| OrderController| --> | OrderService      |
+----------------+     +-------------------+
                              |
                    +---------+---------+
                    v                   v
          +------------------+  +-------------+
          | TableSessionSvc  |  | SseService  |
          +------------------+  +-------------+
                    |
                    v
          +------------------+
          | OrderRepository  |
          | OrderHistoryRepo |
          | TableSessionRepo |
          +------------------+
```

---

## 데이터 흐름

### 고객 주문 흐름
```
customer-app -> POST /api/stores/{id}/orders -> OrderController
  -> OrderService -> TableSessionService (세션 확인)
  -> OrderRepository (저장)
  -> SseService (이벤트 발행) -> admin-app (실시간 수신)
```

### 관리자 모니터링 흐름
```
admin-app -> GET /api/stores/{id}/sse/orders -> SseController
  -> SseService (구독 등록)
  <- SSE 이벤트 스트림 (신규 주문, 상태 변경, 삭제)
```
