# Unit 1: Backend API - 비즈니스 로직 모델

---

## 1. 인증 플로우

### 1.1 테이블 로그인 (US-01, US-02)

```
Client → POST /api/auth/login
  {storeCode, username(=tableNumber), password, role:"TABLE"}

AuthService.authenticate():
  1. Store 조회 (storeCode) → 없으면 404
  2. TableEntity 조회 (storeId + tableNumber) → 없으면 404
  3. 비밀번호 검증 (bcrypt.matches) → 실패 시 401
  4. TableSession 조회 또는 생성:
     a. 해당 테이블의 active=true 세션 조회
     b. 있으면 만료 여부 확인 (expiresAt < now → 세션 종료 후 새로 생성)
     c. 없으면 새 세션 생성 (sessionUuid=UUID, expiresAt=now+16h)
  5. JWT 토큰 발급:
     - claims: storeId, tableId, sessionId, role=TABLE
     - expiration: 16시간
  6. TokenResponse 반환 (token, expiresIn, role, storeId)
```

### 1.2 관리자 로그인 (US-08)

```
Client → POST /api/auth/login
  {storeCode, username, password, role:"ADMIN"}

AuthService.authenticate():
  1. Store 조회 (storeCode) → 없으면 404
  2. StoreUser 조회 (storeId + username) → 없으면 404
  3. 잠금 확인:
     a. lockedUntil != null && lockedUntil > now → 423 Locked 응답 (남은 시간 포함)
  4. 비밀번호 검증 (bcrypt.matches):
     a. 실패 시: loginAttempts++ → 5회 도달 시 lockedUntil = now + 15분 → 401
     b. 성공 시: loginAttempts = 0, lockedUntil = null
  5. JWT 토큰 발급:
     - claims: storeId, userId, role=ADMIN
     - expiration: 16시간
  6. TokenResponse 반환
```

### 1.3 토큰 검증

```
Client → GET /api/auth/validate
  Authorization: Bearer {token}

AuthService.validateToken():
  1. JWT 파싱 및 서명 검증 → 실패 시 401
  2. 만료 확인 → 만료 시 401
  3. claims에서 사용자 정보 추출
  4. UserInfo 반환 (storeId, role, tableId?, username)
```

---

## 2. 주문 생성 플로우 (US-06)

```
Client → POST /api/stores/{storeId}/orders
  {tableId, sessionId, items:[{menuId, menuName, quantity, unitPrice}]}

OrderService.createOrder():
  1. 입력 검증:
     a. items가 비어있으면 400
     b. 각 item의 quantity >= 1 확인
     c. 각 item의 unitPrice >= 0 확인
  2. 세션 검증:
     a. TableSession 조회 (sessionId) → 없으면 404
     b. active=false이면 400 (세션 종료됨)
     c. expiresAt < now이면 400 (세션 만료됨)
  3. 주문 번호 생성:
     a. 형식: ORD-{yyyyMMdd}-{NNN}
     b. NNN: 해당 매장의 당일 주문 순번 (001부터)
     c. 당일 마지막 주문번호 조회 → +1
  4. 총 금액 계산:
     a. totalAmount = SUM(quantity × unitPrice)
  5. Order 엔티티 생성 및 저장
  6. OrderItem 엔티티 목록 생성 및 저장
     a. subtotal = quantity × unitPrice
  7. SSE 이벤트 발행:
     a. eventType: NEW_ORDER
     b. data: 생성된 Order 정보
  8. OrderResponse 반환 (orderId, orderNumber, totalAmount, status, createdAt)
```

---

## 3. 주문 상태 변경 플로우 (US-10)

```
Client → PATCH /api/stores/{storeId}/orders/{orderId}/status
  {status: "PREPARING" | "COMPLETED"}

OrderService.updateOrderStatus():
  1. Order 조회 (orderId + storeId) → 없으면 404
  2. 상태 전이 검증:
     a. 허용 전이:
        - PENDING → PREPARING ✅
        - PENDING → COMPLETED ✅
        - PREPARING → PENDING ✅ (부분 허용)
        - PREPARING → COMPLETED ✅
        - COMPLETED → * ❌ (되돌리기 불가)
     b. 동일 상태 변경 시도 → 400
     c. COMPLETED에서 변경 시도 → 400
  3. 상태 업데이트 및 저장
  4. SSE 이벤트 발행:
     a. eventType: STATUS_CHANGED
     b. data: 변경된 Order 정보
  5. 변경된 Order 반환
```

---

## 4. 주문 삭제 플로우 (US-11)

```
Client → DELETE /api/stores/{storeId}/orders/{orderId}

OrderService.deleteOrder():
  1. Order 조회 (orderId + storeId) → 없으면 404
  2. 관련 OrderItem 삭제
  3. Order 삭제
  4. SSE 이벤트 발행:
     a. eventType: ORDER_DELETED
     b. data: 삭제된 orderId, tableId, tableNumber
  5. 성공 응답 (204 No Content)
```

**참고**: 총 주문액 재계산은 프론트엔드에서 남은 주문 기반으로 계산하거나, getTableSummary API 호출로 처리.

---

## 5. 테이블 세션 관리 플로우 (US-01, US-12)

### 5.1 세션 조회 또는 생성 (로그인 시)

```
TableSessionService.getOrCreateSession():
  1. 해당 테이블의 active=true 세션 조회
  2. 있으면:
     a. expiresAt < now → 세션 만료 처리 (active=false, completedAt=now)
     b. 만료되지 않았으면 기존 세션 반환
  3. 없으면 (또는 만료 처리 후):
     a. 새 세션 생성 (sessionUuid=UUID.randomUUID, expiresAt=now+16h)
     b. 저장 후 반환
```

### 5.2 세션 종료 - 이용 완료 (US-12)

```
Client → POST /api/stores/{storeId}/tables/{tableId}/complete

TableSessionService.completeSession():
  1. 해당 테이블의 active=true 세션 조회 → 없으면 400 (활성 세션 없음)
  2. 현재 세션의 주문 목록 조회 (Order + OrderItem)
  3. 각 주문을 OrderHistory로 변환:
     a. items → JSON 직렬화
     b. completedAt = now
  4. OrderHistory 일괄 저장
  5. 현재 세션의 OrderItem 일괄 삭제
  6. 현재 세션의 Order 일괄 삭제
  7. 세션 종료 (active=false, completedAt=now)
  8. SSE 이벤트 발행:
     a. eventType: TABLE_COMPLETED
     b. data: tableId, tableNumber
  9. 성공 응답
```

### 5.3 과거 주문 내역 조회 (US-13)

```
Client → GET /api/stores/{storeId}/tables/{tableId}/history
  ?dateFrom=2026-04-01&dateTo=2026-04-01

TableSessionService.getTableHistory():
  1. OrderHistory 조회 (storeId + tableId)
  2. 날짜 필터 적용 (dateFrom, dateTo가 있으면)
  3. completedAt 역순 정렬
  4. List<OrderHistory> 반환 (items JSON → 역직렬화하여 반환)
```

---

## 6. 메뉴 CRUD 플로우 (US-03, US-04, US-14, US-15)

### 6.1 카테고리 조회

```
Client → GET /api/stores/{storeId}/categories

MenuService.getCategories():
  1. MenuCategory 조회 (storeId, displayOrder 순)
  2. List<Category> 반환
```

### 6.2 메뉴 조회

```
Client → GET /api/stores/{storeId}/menus?categoryId={optional}

MenuService.getMenuItems():
  1. MenuItem 조회 (storeId, deleted=false)
  2. categoryId 파라미터 있으면 필터 적용
  3. displayOrder 순 정렬
  4. List<MenuItem> 반환 (categoryName 포함)
```

### 6.3 메뉴 등록

```
Client → POST /api/stores/{storeId}/menus
  {name, price, description?, categoryId, imageUrl?, displayOrder?}

MenuService.createMenuItem():
  1. 입력 검증:
     a. name 필수, 비어있으면 400
     b. price 필수, 0~999,999 범위 확인
     c. categoryId 필수, 존재 여부 확인 → 없으면 404
  2. MenuItem 생성 및 저장
  3. 생성된 MenuItem 반환
```

### 6.4 메뉴 수정

```
Client → PATCH /api/stores/{storeId}/menus/{menuId}
  {name?, price?, description?, categoryId?, imageUrl?, displayOrder?}

MenuService.updateMenuItem():
  1. MenuItem 조회 (menuId + storeId, deleted=false) → 없으면 404
  2. 입력 검증 (제공된 필드만):
     a. price 있으면 0~999,999 범위 확인
     b. categoryId 있으면 존재 여부 확인
  3. 제공된 필드만 업데이트 (PATCH 의미론)
  4. 저장 후 반환
```

### 6.5 메뉴 삭제 (소프트 삭제)

```
Client → DELETE /api/stores/{storeId}/menus/{menuId}

MenuService.deleteMenuItem():
  1. MenuItem 조회 (menuId + storeId, deleted=false) → 없으면 404
  2. deleted = true 설정
  3. 저장
  4. 성공 응답 (204 No Content)
```

### 6.6 메뉴 순서 변경

```
Client → PATCH /api/stores/{storeId}/menus/order
  [{menuId, displayOrder}, ...]

MenuService.updateMenuOrder():
  1. 각 항목의 menuId 존재 여부 확인
  2. 각 MenuItem의 displayOrder 업데이트
  3. 일괄 저장
  4. 성공 응답
```

---

## 7. SSE 이벤트 발행/구독 플로우 (US-09)

### 7.1 구독

```
Client → GET /api/stores/{storeId}/sse/orders
  Accept: text/event-stream

SseService.subscribe():
  1. SseEmitter 생성 (timeout: 30분 = 1,800,000ms)
  2. 매장별 emitter 목록에 등록 (ConcurrentHashMap<Long, List<SseEmitter>>)
  3. onCompletion 콜백: emitter 목록에서 제거
  4. onTimeout 콜백: emitter 목록에서 제거
  5. onError 콜백: emitter 목록에서 제거
  6. 초기 연결 확인 이벤트 전송 (event: connected, data: {storeId})
  7. SseEmitter 반환
```

### 7.2 이벤트 발행

```
SseService.publishOrderEvent():
  1. 해당 storeId의 emitter 목록 조회
  2. 각 emitter에 이벤트 전송:
     a. event: orderEvent
     b. data: OrderEvent JSON
  3. 전송 실패한 emitter는 목록에서 제거 (dead connection 정리)
```

### 7.3 이벤트 유형

| eventType | 발생 시점 | data 내용 |
|---|---|---|
| NEW_ORDER | 주문 생성 시 | Order 전체 정보 |
| STATUS_CHANGED | 주문 상태 변경 시 | 변경된 Order 정보 |
| ORDER_DELETED | 주문 삭제 시 | orderId, tableId, tableNumber |
| TABLE_COMPLETED | 이용 완료 시 | tableId, tableNumber |

---

## 8. 매장 전체 주문 조회 (US-09)

```
Client → GET /api/stores/{storeId}/orders/all

OrderService.getActiveOrdersByStore():
  1. 해당 매장의 활성 세션(active=true)에 속한 주문 조회
  2. Order + OrderItem 함께 로드
  3. createdAt 순 정렬
  4. List<Order> 반환
```

---

## 9. 테이블 관련 조회 (US-09, US-12)

### 9.1 테이블 목록 조회

```
Client → GET /api/stores/{storeId}/tables

TableController.getTables():
  1. 해당 매장의 테이블 목록 조회
  2. 각 테이블의 활성 세션 정보 포함
  3. 각 테이블의 현재 총 주문액, 주문 수 계산
  4. List<TableInfo> 반환
```

### 9.2 테이블 요약 정보

```
Client → GET /api/stores/{storeId}/tables/{tableId}/summary

TableController.getTableSummary():
  1. 테이블 조회 → 없으면 404
  2. 활성 세션의 주문 목록 조회
  3. 총 주문액 계산
  4. TableSummary 반환 (tableId, tableNumber, totalAmount, orders)
```
