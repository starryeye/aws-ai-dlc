# Unit 2: Customer Frontend - 비즈니스 로직 모델

---

## 1. SetupPage - 초기 설정 및 인증

### 진입 조건
- localStorage에 유효한 토큰이 없을 때 표시
- 자동 로그인 실패 시 리다이렉트

### 플로우
```
앱 시작
  → localStorage에서 StoredCredentials 확인
  → 토큰 존재?
    → Yes: GET /api/auth/validate 호출
      → 유효: MenuPage로 이동 + 세션 조회
      → 무효: localStorage 클리어 → SetupPage 표시
    → No: SetupPage 표시

SetupPage 입력
  → storeCode, tableNumber, password 입력
  → POST /api/auth/login (role: TABLE)
  → 성공: StoredCredentials를 localStorage에 저장
         → GET /api/stores/{storeId}/tables/{tableId}/session (세션 조회/생성)
         → sessionId를 localStorage에 저장
         → MenuPage로 이동
  → 실패: 인라인 에러 메시지 표시
```

### 상태 관리
- `isLoading`: boolean - 로그인 요청 중
- `error`: string | null - 에러 메시지

---

## 2. MenuPage - 카테고리별 메뉴 조회

### 진입 조건
- 유효한 인증 토큰 보유
- 기본(홈) 화면

### 플로우
```
MenuPage 진입
  → GET /api/stores/{storeId}/categories (카테고리 목록)
  → GET /api/stores/{storeId}/menus (전체 메뉴 목록)
  → 스켈레톤 UI → 데이터 로드 완료 → 렌더링

카테고리 선택
  → 선택된 categoryId로 메뉴 목록 필터링 (클라이언트 사이드)
  → "전체" 선택 시 필터 해제

[담기] 버튼 클릭
  → CartItem 생성 (menuId, menuName, unitPrice, quantity: 1)
  → 이미 장바구니에 있으면 quantity + 1
  → localStorage 업데이트
  → CartBadge 수량 갱신
```

### 상태 관리
- `categories`: Category[] - 카테고리 목록
- `menuItems`: MenuItem[] - 전체 메뉴 목록
- `selectedCategoryId`: number | null - 선택된 카테고리 (null = 전체)
- `isLoading`: boolean - 데이터 로딩 중

---

## 3. CartPage - 장바구니 관리

### 진입 조건
- 상단 헤더의 장바구니 링크로 이동

### 플로우
```
CartPage 진입
  → localStorage에서 CartItem[] 로드
  → totalAmount, totalQuantity 계산

수량 변경
  → +/- 버튼으로 quantity 조절
  → quantity가 0이 되면 아이템 제거
  → localStorage 즉시 업데이트
  → totalAmount 재계산

아이템 삭제
  → 해당 CartItem 제거
  → localStorage 업데이트

장바구니 비우기
  → 전체 CartItem 제거
  → localStorage 클리어 (장바구니 키만)

주문하기 버튼
  → items가 비어있으면 비활성화
  → OrderConfirmPage로 이동
```

### 상태 관리
- `cart`: CartState - 장바구니 전체 상태
- localStorage 키: `table-order-cart`

---

## 4. OrderConfirmPage - 주문 확인 및 확정

### 진입 조건
- CartPage에서 "주문하기" 클릭
- 장바구니에 1개 이상 아이템 존재

### 플로우
```
OrderConfirmPage 진입
  → localStorage에서 CartItem[] 로드
  → 주문 내역 표시 (메뉴명, 수량, 단가, 소계)
  → 총 금액 표시

주문 확정 클릭
  → 버튼 비활성화 (이중 클릭 방지)
  → 버튼 내 로딩 스피너 표시
  → OrderRequest 생성:
      tableId: StoredCredentials.tableId
      sessionId: localStorage의 sessionId
      items: CartItem[] → OrderItemRequest[] 변환
  → POST /api/stores/{storeId}/orders
  → 성공:
      localStorage 장바구니 클리어
      OrderSuccessPage로 이동 (orderNumber, totalAmount 전달)
  → 실패:
      버튼 재활성화
      인라인 에러 메시지 표시
      장바구니 유지
```

### 상태 관리
- `isSubmitting`: boolean - 주문 요청 중 (이중 클릭 방지)
- `error`: string | null - 에러 메시지

---

## 5. OrderSuccessPage - 주문 성공

### 진입 조건
- OrderConfirmPage에서 주문 성공 후 이동

### 플로우
```
OrderSuccessPage 진입
  → 주문 번호, 총 금액 표시
  → 5초 카운트다운 시작
  → 카운트다운 완료 → MenuPage로 자동 리다이렉트
  → "메뉴로 돌아가기" 버튼 (즉시 이동)
```

### 상태 관리
- `countdown`: number - 남은 초 (5 → 0)

---

## 6. OrderHistoryPage - 세션 주문 내역 조회

### 진입 조건
- 상단 헤더의 주문내역 링크로 이동

### 플로우
```
OrderHistoryPage 진입
  → GET /api/stores/{storeId}/orders?sessionId={sessionId}
  → 스켈레톤 UI → 데이터 로드 완료
  → 주문 목록 표시 (시간순 정렬)
  → 각 주문: 주문번호, 시각, 메뉴/수량, 금액, 상태 배지

새로고침
  → 동일 API 재호출
```

### 상태 관리
- `orders`: Order[] - 주문 목록
- `isLoading`: boolean - 데이터 로딩 중

---

## 7. 공통 로직

### 인증 인터셉터 (Axios)
```
모든 API 요청
  → Authorization: Bearer {token} 헤더 자동 추가
  → 401 응답 수신 시:
      localStorage 클리어
      SetupPage로 리다이렉트
```

### 라우팅 가드
```
/table/* 라우트 접근
  → localStorage에 토큰 존재?
    → No: /table/setup으로 리다이렉트
    → Yes: 요청 페이지 표시
```
