# Unit 2: Customer Frontend - 프론트엔드 컴포넌트 설계

---

## 1. 컴포넌트 계층 구조

```
App
├── TableRouter (/table/*)
│   ├── AuthGuard (라우팅 가드)
│   │   ├── Header (공통 상단 헤더)
│   │   │   ├── 매장명
│   │   │   ├── CartBadge (장바구니 아이콘 + 수량)
│   │   │   └── 주문내역 링크
│   │   ├── MenuPage (/)
│   │   │   ├── CategoryNav (카테고리 가로 탭)
│   │   │   └── MenuCard[] (메뉴 카드 그리드)
│   │   ├── CartPage (/cart)
│   │   │   └── CartItemRow[] (장바구니 아이템 행)
│   │   ├── OrderConfirmPage (/order/confirm)
│   │   │   └── OrderItemRow[] (주문 확인 아이템 행)
│   │   ├── OrderSuccessPage (/order/success)
│   │   └── OrderHistoryPage (/orders)
│   │       └── OrderCard[] (주문 카드)
│   └── SetupPage (/setup) (AuthGuard 밖)
```

---

## 2. 라우팅 구조

| 경로 | 컴포넌트 | 인증 필요 | 설명 |
|---|---|---|---|
| /table/setup | SetupPage | No | 초기 설정 |
| /table | MenuPage | Yes | 메뉴 조회 (기본 화면) |
| /table/cart | CartPage | Yes | 장바구니 |
| /table/order/confirm | OrderConfirmPage | Yes | 주문 확인 |
| /table/order/success | OrderSuccessPage | Yes | 주문 성공 |
| /table/orders | OrderHistoryPage | Yes | 주문 내역 |

---

## 3. 페이지 컴포넌트 상세

### SetupPage

```
┌─────────────────────────────┐
│       🍽️ 테이블오더          │
│                             │
│  ┌───────────────────────┐  │
│  │ 매장 식별자            │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ 테이블 번호            │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ 비밀번호              │  │
│  └───────────────────────┘  │
│  (에러 메시지 영역)          │
│  ┌───────────────────────┐  │
│  │      설정 완료         │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

| Props/State | 타입 | 설명 |
|---|---|---|
| storeCode | string | 매장 식별자 입력값 |
| tableNumber | string | 테이블 번호 입력값 |
| password | string | 비밀번호 입력값 |
| isLoading | boolean | 로그인 요청 중 |
| error | string \| null | 에러 메시지 |

### MenuPage

```
┌─────────────────────────────┐
│  🍽️ 매장명     🛒(3) 주문내역 │  ← Header
├─────────────────────────────┤
│ [전체] [메인] [사이드] [음료] │  ← CategoryNav
├──────────────┬──────────────┤
│ ┌──────────┐ │ ┌──────────┐ │
│ │  🖼️       │ │ │  🖼️       │ │
│ │ 김치찌개   │ │ │ 된장찌개   │ │
│ │ ₩8,000    │ │ │ ₩7,500    │ │
│ │  [담기]   │ │ │  [담기]   │ │  ← MenuCard
│ └──────────┘ │ └──────────┘ │
│ ┌──────────┐ │ ┌──────────┐ │
│ │  🖼️       │ │ │  🖼️       │ │
│ │ 불고기     │ │ │ 비빔밥    │ │
│ │ ₩12,000   │ │ │ ₩9,000   │ │
│ │  [담기]   │ │ │  [담기]   │ │
│ └──────────┘ │ └──────────┘ │
└──────────────┴──────────────┘
```

| Props/State | 타입 | 설명 |
|---|---|---|
| categories | Category[] | 카테고리 목록 |
| menuItems | MenuItem[] | 전체 메뉴 목록 |
| selectedCategoryId | number \| null | 선택된 카테고리 |
| isLoading | boolean | 데이터 로딩 중 |

### CartPage

```
┌─────────────────────────────┐
│  ← 장바구니        🛒(3)     │
├─────────────────────────────┤
│  김치찌개    [-] 2 [+]       │
│             ₩8,000  ₩16,000 │
│─────────────────────────────│
│  불고기      [-] 1 [+]       │
│             ₩12,000 ₩12,000 │
│─────────────────────────────│
│                             │
│  [장바구니 비우기]            │
├─────────────────────────────┤
│  총 금액          ₩28,000   │
│  ┌───────────────────────┐  │
│  │      주문하기          │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

| Props/State | 타입 | 설명 |
|---|---|---|
| cart | CartState | 장바구니 상태 (localStorage) |

### OrderConfirmPage

```
┌─────────────────────────────┐
│  ← 주문 확인                 │
├─────────────────────────────┤
│  테이블 {번호}               │
│─────────────────────────────│
│  김치찌개     2개    ₩16,000 │
│  불고기       1개    ₩12,000 │
│─────────────────────────────│
│  총 금액          ₩28,000   │
│  (에러 메시지 영역)          │
│  ┌───────────────────────┐  │
│  │     주문 확정          │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

| Props/State | 타입 | 설명 |
|---|---|---|
| cart | CartState | 장바구니 상태 |
| isSubmitting | boolean | 주문 요청 중 (이중 클릭 방지) |
| error | string \| null | 에러 메시지 |

### OrderSuccessPage

```
┌─────────────────────────────┐
│                             │
│          ✅ 주문 완료        │
│                             │
│     주문번호: ORD-00042     │
│     총 금액: ₩28,000        │
│                             │
│   3초 후 메뉴로 이동합니다    │
│                             │
│  ┌───────────────────────┐  │
│  │   메뉴로 돌아가기      │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

| Props/State | 타입 | 설명 |
|---|---|---|
| orderNumber | string | 주문 번호 (라우트 state) |
| totalAmount | number | 총 금액 (라우트 state) |
| countdown | number | 리다이렉트 카운트다운 (5→0) |

### OrderHistoryPage

```
┌─────────────────────────────┐
│  ← 주문 내역                 │
├─────────────────────────────┤
│  ┌───────────────────────┐  │
│  │ ORD-00042  14:30      │  │
│  │ 김치찌개 2, 불고기 1    │  │
│  │ ₩28,000    [대기중]    │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ ORD-00041  14:15      │  │
│  │ 비빔밥 1              │  │
│  │ ₩9,000     [완료]     │  │
│  └───────────────────────┘  │
│                             │
│  (주문이 없으면)             │
│  "아직 주문 내역이 없습니다"  │
└─────────────────────────────┘
```

| Props/State | 타입 | 설명 |
|---|---|---|
| orders | Order[] | 주문 목록 |
| isLoading | boolean | 데이터 로딩 중 |

---

## 4. 공통 컴포넌트

### Header
| Props | 타입 | 설명 |
|---|---|---|
| - | - | 인증 상태에서 항상 표시 |

내부 구성: 매장명(좌), CartBadge(우), 주문내역 링크(우)

### CategoryNav
| Props | 타입 | 설명 |
|---|---|---|
| categories | Category[] | 카테고리 목록 |
| selectedId | number \| null | 선택된 카테고리 |
| onSelect | (id: number \| null) => void | 카테고리 선택 콜백 |

### MenuCard
| Props | 타입 | 설명 |
|---|---|---|
| item | MenuItem | 메뉴 아이템 |
| onAdd | (item: MenuItem) => void | 장바구니 추가 콜백 |

### CartBadge
| Props | 타입 | 설명 |
|---|---|---|
| count | number | 장바구니 총 수량 |

---

## 5. 상태 관리 구조

### Context 구성
```
AuthContext
  - credentials: StoredCredentials | null
  - sessionId: string | null
  - login(req): Promise<void>
  - logout(): void

CartContext
  - cart: CartState
  - addItem(menuItem): void
  - updateQuantity(menuId, quantity): void
  - removeItem(menuId): void
  - clearCart(): void
```

### 데이터 흐름
```
localStorage ←→ AuthContext ←→ 페이지 컴포넌트 ←→ API (Axios)
localStorage ←→ CartContext ←→ 페이지 컴포넌트
```

---

## 6. API 연동 포인트

| 페이지 | API 엔드포인트 | HTTP | 시점 |
|---|---|---|---|
| SetupPage | /api/auth/login | POST | 설정 완료 클릭 |
| SetupPage | /api/auth/validate | GET | 앱 시작 시 토큰 검증 |
| MenuPage | /api/stores/{storeId}/categories | GET | 페이지 진입 |
| MenuPage | /api/stores/{storeId}/menus | GET | 페이지 진입 |
| OrderConfirmPage | /api/stores/{storeId}/orders | POST | 주문 확정 클릭 |
| OrderHistoryPage | /api/stores/{storeId}/orders?sessionId={id} | GET | 페이지 진입 |
