# Unit 3: Admin Frontend - 비즈니스 로직 모델

---

## 1. 관리자 인증 플로우

```
[LoginPage]
    |
    v
사용자 입력 (매장코드, 사용자명, 비밀번호)
    |
    v
POST /api/auth/login (role: ADMIN)
    |
    +-- 성공 --> JWT 토큰 localStorage 저장
    |           --> DashboardPage로 리다이렉트
    |
    +-- 실패 --> 에러 메시지 표시
                --> 로그인 시도 제한 안내

[세션 유지]
    |
    v
페이지 로드 시 토큰 존재 확인
    |
    +-- 토큰 있음 --> GET /api/auth/validate
    |                   +-- 유효 --> 현재 페이지 유지
    |                   +-- 만료 --> 토큰 삭제 + LoginPage 리다이렉트
    |
    +-- 토큰 없음 --> LoginPage 리다이렉트

[자동 로그아웃]
    |
    v
16시간 만료 시 --> 토큰 삭제 + LoginPage 리다이렉트 + 안내 메시지
```

---

## 2. 실시간 주문 모니터링 플로우

```
[DashboardPage 진입]
    |
    v
GET /api/stores/{storeId}/orders/all (초기 데이터 로드)
    |
    v
GET /api/stores/{storeId}/sse/orders (SSE 구독)
    |
    v
[SSE 이벤트 수신 루프]
    |
    +-- NEW_ORDER --> 테이블 카드에 주문 추가
    |                 --> 신규 주문 시각적 강조 (하이라이트)
    |                 --> 총 주문액 재계산
    |
    +-- STATUS_CHANGED --> 해당 주문 상태 업데이트
    |
    +-- ORDER_DELETED --> 해당 주문 제거
    |                    --> 총 주문액 재계산
    |
    +-- TABLE_COMPLETED --> 해당 테이블 카드 리셋

[SSE 연결 끊김]
    |
    v
자동 재연결 (3초 대기 후 재시도, 최대 5회)
    +-- 재연결 성공 --> 전체 데이터 재로드 + SSE 재구독
    +-- 재연결 실패 --> 에러 배너 표시 + 수동 새로고침 안내
```

---

## 3. 테이블 관리 플로우

### 3.1 주문 삭제
```
[TableManagementPage] 또는 [DashboardPage 주문 상세]
    |
    v
삭제 버튼 클릭
    |
    v
ConfirmDialog 표시 ("이 주문을 삭제하시겠습니까?")
    |
    +-- 확인 --> DELETE /api/stores/{storeId}/orders/{orderId}
    |            +-- 성공 --> 성공 토스트 메시지
    |            +-- 실패 --> 에러 토스트 메시지
    |
    +-- 취소 --> 다이얼로그 닫기
```

### 3.2 테이블 이용 완료
```
[TableManagementPage]
    |
    v
이용 완료 버튼 클릭
    |
    v
ConfirmDialog 표시 ("테이블 이용을 완료하시겠습니까? 주문 내역이 과거 이력으로 이동됩니다.")
    |
    +-- 확인 --> POST /api/stores/{storeId}/tables/{tableId}/complete
    |            +-- 성공 --> 테이블 카드 리셋 + 성공 토스트
    |            +-- 실패 --> 에러 토스트 메시지
    |
    +-- 취소 --> 다이얼로그 닫기
```

### 3.3 과거 주문 내역 조회
```
[TableManagementPage]
    |
    v
과거 내역 버튼 클릭
    |
    v
OrderHistoryModal 열기
    |
    v
GET /api/stores/{storeId}/tables/{tableId}/history (기본: 오늘)
    |
    v
날짜 필터 변경 시 --> 재조회
    |
    v
닫기 버튼 --> 모달 닫기
```

---

## 4. 메뉴 관리 CRUD 플로우

```
[MenuManagementPage]
    |
    v
GET /api/stores/{storeId}/categories (카테고리 로드)
GET /api/stores/{storeId}/menus (메뉴 목록 로드)
    |
    v
[카테고리 탭 선택] --> 해당 카테고리 메뉴 필터링
    |
    +-- 메뉴 등록 버튼 --> MenuFormModal (빈 폼)
    |                       --> 입력 + 검증 + POST /api/stores/{storeId}/menus
    |                       --> 성공: 목록 갱신 + 모달 닫기
    |
    +-- 메뉴 수정 버튼 --> MenuFormModal (기존 데이터 채움)
    |                       --> 수정 + 검증 + PATCH /api/stores/{storeId}/menus/{menuId}
    |                       --> 성공: 목록 갱신 + 모달 닫기
    |
    +-- 메뉴 삭제 버튼 --> ConfirmDialog
    |                       --> 확인: DELETE /api/stores/{storeId}/menus/{menuId}
    |                       --> 성공: 목록 갱신
    |
    +-- 순서 변경 --> 드래그앤드롭 또는 위/아래 버튼
                      --> PATCH /api/stores/{storeId}/menus/order
```

---

## 5. 상태 관리 구조 (Context + useReducer)

### AuthContext
```typescript
State: { token, storeId, username, isAuthenticated, isLoading }
Actions: LOGIN, LOGOUT, TOKEN_VALIDATED, TOKEN_EXPIRED
```

### OrderContext
```typescript
State: { orders, tableMap, isConnected, error }
Actions: SET_ORDERS, ADD_ORDER, UPDATE_ORDER_STATUS,
         REMOVE_ORDER, RESET_TABLE, SET_CONNECTED, SET_ERROR
```

### MenuContext
```typescript
State: { categories, menuItems, isLoading, error }
Actions: SET_CATEGORIES, SET_MENU_ITEMS, ADD_MENU_ITEM,
         UPDATE_MENU_ITEM, REMOVE_MENU_ITEM, REORDER_MENU_ITEMS
```
