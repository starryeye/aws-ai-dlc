# Unit 2: Customer Frontend - 도메인 엔티티 정의

## TypeScript 타입/인터페이스

---

### 1. 인증 관련

```typescript
/** 로그인 요청 (SetupPage → API) */
interface LoginRequest {
  storeCode: string;
  username: string;   // 테이블 번호
  password: string;
  role: 'TABLE';
}

/** 로그인 응답 */
interface TokenResponse {
  token: string;
  expiresIn: number;  // 초 단위 (57600 = 16시간)
  role: 'TABLE';
  storeId: number;
}

/** 토큰에서 추출한 사용자 정보 */
interface UserInfo {
  storeId: number;
  role: 'TABLE';
  tableId: number;
  username: string;
}

/** localStorage에 저장하는 인증 정보 */
interface StoredCredentials {
  storeCode: string;
  tableNumber: string;
  password: string;
  token: string;
  storeId: number;
  tableId: number;
}
```

### 2. 메뉴 관련

```typescript
/** 메뉴 카테고리 */
interface Category {
  id: number;
  name: string;
  displayOrder: number;
}

/** 메뉴 아이템 */
interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string | null;
  categoryId: number;
  categoryName: string;
  imageUrl: string | null;
  displayOrder: number;
}
```

### 3. 장바구니 관련

```typescript
/** 장바구니 아이템 (localStorage 저장) */
interface CartItem {
  menuId: number;
  menuName: string;
  unitPrice: number;
  quantity: number;
}

/** 장바구니 상태 */
interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
}
```

### 4. 주문 관련

```typescript
/** 주문 요청 */
interface OrderRequest {
  tableId: number;
  sessionId: string;
  items: OrderItemRequest[];
}

interface OrderItemRequest {
  menuId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

/** 주문 생성 응답 */
interface OrderResponse {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

/** 주문 상세 (내역 조회용) */
interface Order {
  id: number;
  orderNumber: string;
  tableId: number;
  tableNumber: string;
  sessionId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

interface OrderItem {
  id: number;
  menuId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

type OrderStatus = 'PENDING' | 'PREPARING' | 'COMPLETED';
```

### 5. 세션 관련

```typescript
/** 테이블 세션 */
interface TableSession {
  sessionId: string;
  storeId: number;
  tableId: number;
  active: boolean;
}
```

### 6. 공통

```typescript
/** API 에러 응답 */
interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}
```
