# Unit 3: Admin Frontend - 프론트엔드 컴포넌트 상세

---

## 1. 컴포넌트 계층 구조

```
AdminApp (라우터 + Context Providers)
+-- AdminLayout (사이드바 + 콘텐츠 영역)
|   +-- AdminNavigation (좌측 사이드바)
|   +-- <Outlet/> (페이지 콘텐츠)
|       +-- DashboardPage
|       |   +-- ConnectionStatus (SSE 연결 상태)
|       |   +-- TableCardGrid (반응형 그리드)
|       |       +-- TableCard (테이블별 카드)
|       |           +-- OrderStatusBadge
|       |           +-- OrderPreviewList (최신 주문 미리보기)
|       |   +-- OrderDetailModal
|       |       +-- OrderItemList
|       |       +-- StatusDropdown
|       |
|       +-- TableManagementPage
|       |   +-- TableList
|       |       +-- TableManagementCard
|       |           +-- OrderSummary
|       |           +-- ActionButtons (삭제, 이용완료, 과거내역)
|       |   +-- OrderHistoryModal
|       |       +-- DateFilter
|       |       +-- HistoryList
|       |
|       +-- MenuManagementPage
|           +-- CategoryTabs
|           +-- MenuItemList
|           |   +-- MenuItemRow (수정/삭제 버튼)
|           +-- MenuFormModal (등록/수정 폼)
|           +-- ConfirmDialog (삭제 확인)
|
+-- LoginPage (레이아웃 밖, 인증 전)
```

---

## 2. 페이지별 상세

### 2.1 LoginPage

**경로**: `/admin/login`

**State**:
```typescript
{
  storeCode: string
  username: string
  password: string
  isLoading: boolean
  error: string | null
}
```

**API 연동**:
- POST /api/auth/login (role: ADMIN)

**인터랙션**:
- 폼 입력 → 검증 → 로그인 요청 → 성공 시 /admin/dashboard 리다이렉트

---

### 2.2 DashboardPage

**경로**: `/admin/dashboard`

**State** (OrderContext):
```typescript
{
  orders: Order[]                    // 전체 활성 주문
  tableMap: Map<number, TableData>   // 테이블ID → {orders, totalAmount}
  isConnected: boolean               // SSE 연결 상태
  error: string | null
  selectedOrder: Order | null        // 상세 보기 선택된 주문
  highlightedOrderIds: Set<number>   // 신규 주문 하이라이트
}
```

**API 연동**:
- GET /api/stores/{storeId}/orders/all (초기 로드)
- GET /api/stores/{storeId}/sse/orders (SSE 구독)
- PATCH /api/stores/{storeId}/orders/{orderId}/status (상태 변경)

**인터랙션**:
- 테이블 카드 클릭 → OrderDetailModal 열기
- 드롭다운으로 주문 상태 변경
- SSE 이벤트 수신 시 자동 UI 업데이트
- 신규 주문 5초간 하이라이트

---

### 2.3 TableManagementPage

**경로**: `/admin/tables`

**State**:
```typescript
{
  tables: TableInfo[]
  selectedTable: TableInfo | null
  showHistoryModal: boolean
  showConfirmDialog: boolean
  confirmAction: 'delete' | 'complete' | null
  targetOrderId: number | null
  targetTableId: number | null
}
```

**API 연동**:
- GET /api/stores/{storeId}/tables (테이블 목록)
- GET /api/stores/{storeId}/tables/{tableId}/summary (테이블 요약)
- DELETE /api/stores/{storeId}/orders/{orderId} (주문 삭제)
- POST /api/stores/{storeId}/tables/{tableId}/complete (이용 완료)
- GET /api/stores/{storeId}/tables/{tableId}/history (과거 내역)

**인터랙션**:
- 주문 삭제 → ConfirmDialog → API 호출 → 목록 갱신
- 이용 완료 → ConfirmDialog → API 호출 → 테이블 리셋
- 과거 내역 → OrderHistoryModal → 날짜 필터링

---

### 2.4 MenuManagementPage

**경로**: `/admin/menus`

**State** (MenuContext):
```typescript
{
  categories: Category[]
  menuItems: MenuItem[]
  selectedCategory: number | null
  isLoading: boolean
  error: string | null
  showFormModal: boolean
  editingItem: MenuItem | null       // null이면 등록, 값이면 수정
  showDeleteConfirm: boolean
  deletingItemId: number | null
}
```

**API 연동**:
- GET /api/stores/{storeId}/categories
- GET /api/stores/{storeId}/menus?categoryId={id}
- POST /api/stores/{storeId}/menus (등록)
- PATCH /api/stores/{storeId}/menus/{menuId} (수정)
- DELETE /api/stores/{storeId}/menus/{menuId} (삭제)
- PATCH /api/stores/{storeId}/menus/order (순서 변경)

**인터랙션**:
- 카테고리 탭 선택 → 메뉴 필터링
- 등록 버튼 → MenuFormModal (빈 폼)
- 수정 버튼 → MenuFormModal (기존 데이터)
- 삭제 버튼 → ConfirmDialog → API 호출
- 순서 변경 → 위/아래 버튼 → API 호출

---

## 3. 공통 컴포넌트 Props

### TableCard
```typescript
Props: {
  tableNumber: string
  totalAmount: number
  orders: Order[]
  isHighlighted: boolean
  onClick: () => void
}
```

### OrderStatusBadge
```typescript
Props: {
  status: 'PENDING' | 'PREPARING' | 'COMPLETED'
}
// 색상: PENDING=노란색, PREPARING=파란색, COMPLETED=초록색
```

### StatusDropdown
```typescript
Props: {
  currentStatus: string
  orderId: number
  onStatusChange: (orderId: number, newStatus: string) => void
  disabled: boolean  // COMPLETED일 때 true
}
```

### ConfirmDialog
```typescript
Props: {
  isOpen: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}
```

### MenuFormModal
```typescript
Props: {
  isOpen: boolean
  editingItem: MenuItem | null  // null이면 등록 모드
  categories: Category[]
  onSubmit: (data: MenuItemRequest) => void
  onClose: () => void
  isLoading: boolean
}
```

### OrderHistoryModal
```typescript
Props: {
  isOpen: boolean
  tableId: number
  tableNumber: string
  onClose: () => void
}
// 내부에서 날짜 필터 상태 관리 및 API 호출
```

### ConnectionStatus
```typescript
Props: {
  isConnected: boolean
}
// 녹색 점 = 연결됨, 빨간색 점 = 연결 끊김
```

### AdminNavigation
```typescript
// 좌측 사이드바
// 메뉴 항목: 대시보드, 테이블 관리, 메뉴 관리
// 현재 경로에 따라 활성 항목 하이라이트
// 하단: 로그아웃 버튼
```
