# Unit 3: Admin Frontend - 도메인 엔티티 (TypeScript 타입)

---

## API Response 타입

```typescript
// 인증
interface TokenResponse {
  token: string
  expiresIn: number
  role: string
  storeId: number
}

interface UserInfo {
  storeId: number
  role: string
  tableId?: number
  username: string
}

// 카테고리
interface Category {
  id: number
  name: string
  displayOrder: number
}

// 메뉴
interface MenuItem {
  id: number
  name: string
  price: number
  description?: string
  categoryId: number
  categoryName: string
  imageUrl?: string
  displayOrder: number
}

// 주문
interface Order {
  id: number
  orderNumber: string
  tableId: number
  tableNumber: string
  sessionId: string
  items: OrderItem[]
  totalAmount: number
  status: 'PENDING' | 'PREPARING' | 'COMPLETED'
  createdAt: string
}

interface OrderItem {
  id: number
  menuId: number
  menuName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

// 테이블
interface TableInfo {
  id: number
  tableNumber: string
  sessionId?: string
  sessionActive: boolean
  totalAmount: number
  orderCount: number
}

interface TableSummary {
  tableId: number
  tableNumber: string
  totalAmount: number
  orders: Order[]
}

// 주문 이력
interface OrderHistory {
  id: number
  orderNumber: string
  tableNumber: string
  items: OrderItem[]
  totalAmount: number
  orderedAt: string
  completedAt: string
}

// SSE 이벤트
interface OrderEvent {
  eventType: 'NEW_ORDER' | 'STATUS_CHANGED' | 'ORDER_DELETED' | 'TABLE_COMPLETED'
  orderId?: number
  tableId: number
  tableNumber: string
  data: Order | null
}
```

---

## API Request 타입

```typescript
interface LoginRequest {
  storeCode: string
  username: string
  password: string
  role: 'ADMIN'
}

interface MenuItemRequest {
  name: string
  price: number
  description?: string
  categoryId: number
  imageUrl?: string
  displayOrder?: number
}

interface MenuOrderRequest {
  menuId: number
  displayOrder: number
}

interface StatusRequest {
  status: 'PENDING' | 'PREPARING' | 'COMPLETED'
}
```

---

## 프론트엔드 전용 타입

```typescript
// 테이블별 데이터 (대시보드용)
interface TableData {
  tableId: number
  tableNumber: string
  orders: Order[]
  totalAmount: number
  latestOrderTime?: string
}

// 날짜 필터
interface DateFilter {
  dateFrom: string  // YYYY-MM-DD
  dateTo: string    // YYYY-MM-DD
}

// 확인 다이얼로그 상태
interface ConfirmState {
  isOpen: boolean
  title: string
  message: string
  action: (() => void) | null
}
```

---

## Testable Properties (PBT-01)

### 식별된 속성

| 컴포넌트 | 속성 카테고리 | 속성 설명 |
|---|---|---|
| OrderContext reducer | Invariant | 주문 추가/삭제 후 tableMap의 totalAmount는 해당 테이블 주문 합계와 일치 |
| OrderContext reducer | Invariant | SET_ORDERS 후 tableMap의 테이블 수는 고유 tableId 수와 일치 |
| OrderContext reducer | Idempotence | 동일 주문 ID로 UPDATE_ORDER_STATUS를 2번 호출해도 결과 동일 |
| MenuContext reducer | Invariant | REORDER_MENU_ITEMS 후 menuItems 개수 보존 |
| MenuContext reducer | Invariant | ADD_MENU_ITEM 후 menuItems 길이 = 이전 + 1 |
| 메뉴 폼 검증 | Easy verification | 검증 통과한 MenuItemRequest는 모든 필수 필드가 유효 |
| 날짜 필터 검증 | Invariant | dateFrom <= dateTo 항상 성립 |
| 주문 상태 전이 | Invariant | 상태 전이는 PENDING→PREPARING→COMPLETED 순서만 허용 |

### PBT 미적용 컴포넌트
- LoginPage: 단순 폼 제출, PBT 속성 없음
- UI 렌더링 컴포넌트 (TableCard, OrderStatusBadge 등): 순수 표시 컴포넌트, PBT 속성 없음
