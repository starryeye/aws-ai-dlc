# Unit 2: Customer Frontend - 비즈니스 규칙

---

## 1. 인증 규칙

| 규칙 ID | 규칙 | 설명 |
|---|---|---|
| AUTH-01 | 로그인 역할 고정 | Customer Frontend는 항상 role: 'TABLE'로 로그인 |
| AUTH-02 | 토큰 저장 | JWT 토큰은 localStorage에 저장 |
| AUTH-03 | 자동 로그인 실패 처리 | 토큰 검증 실패 시 localStorage 클리어 후 SetupPage 이동 |
| AUTH-04 | 401 글로벌 처리 | 모든 API 401 응답 시 자동 로그아웃 → SetupPage 이동 |
| AUTH-05 | 세션 만료 | 16시간 후 토큰 만료, 재설정 필요 |

---

## 2. 입력 유효성 검증

### SetupPage 입력 검증

| 필드 | 규칙 | 에러 메시지 |
|---|---|---|
| storeCode | 필수, 빈 문자열 불가 | "매장 식별자를 입력해주세요" |
| tableNumber | 필수, 빈 문자열 불가 | "테이블 번호를 입력해주세요" |
| password | 필수, 빈 문자열 불가 | "비밀번호를 입력해주세요" |

### 장바구니 규칙

| 규칙 ID | 규칙 | 설명 |
|---|---|---|
| CART-01 | 수량 최소값 | quantity >= 1 (0이 되면 아이템 자동 제거) |
| CART-02 | 수량 제한 없음 | 최대 수량/종류 제한 없음 |
| CART-03 | 중복 메뉴 처리 | 동일 menuId 추가 시 quantity 증가 (새 아이템 생성 안 함) |
| CART-04 | 가격 스냅샷 | 장바구니 추가 시점의 unitPrice 저장 (이후 메뉴 가격 변경 무관) |
| CART-05 | 영속성 | localStorage에 저장, 페이지 새로고침 시 유지 |
| CART-06 | 주문 후 클리어 | 주문 성공 시 장바구니 자동 비우기 |

---

## 3. 주문 규칙

| 규칙 ID | 규칙 | 설명 |
|---|---|---|
| ORDER-01 | 최소 아이템 | 1개 이상의 아이템이 있어야 주문 가능 |
| ORDER-02 | 이중 클릭 방지 | 주문 확정 버튼 클릭 시 즉시 비활성화, 응답 후 재활성화 |
| ORDER-03 | 세션 ID 필수 | 주문 시 유효한 sessionId 필요 |
| ORDER-04 | 가격 스냅샷 전송 | 주문 시 menuName, unitPrice는 장바구니 저장 시점 값 사용 |
| ORDER-05 | 실패 시 장바구니 유지 | 주문 실패 시 장바구니 데이터 보존 |
| ORDER-06 | 성공 후 리다이렉트 | 주문 성공 → OrderSuccessPage → 5초 후 MenuPage |

---

## 4. 금액 계산 규칙

| 규칙 ID | 규칙 | 수식 |
|---|---|---|
| CALC-01 | 아이템 소계 | subtotal = unitPrice × quantity |
| CALC-02 | 총 금액 | totalAmount = Σ(각 아이템의 subtotal) |
| CALC-03 | 금액 표시 형식 | 원화(₩) + 천 단위 콤마 (예: ₩12,000) |

---

## 5. 상태 표시 규칙

| 상태 | 한글 표시 | 색상 의미 |
|---|---|---|
| PENDING | 대기중 | 주황/노랑 |
| PREPARING | 준비중 | 파랑 |
| COMPLETED | 완료 | 초록 |

---

## 6. 에러 처리 규칙

| 상황 | 처리 방식 |
|---|---|
| 네트워크 오류 | 인라인 에러 메시지: "네트워크 연결을 확인해주세요" |
| 401 Unauthorized | localStorage 클리어 → SetupPage 이동 |
| 404 Not Found | 인라인 에러 메시지: "요청한 정보를 찾을 수 없습니다" |
| 500 Server Error | 인라인 에러 메시지: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요" |
| 로그인 실패 | 인라인 에러 메시지: "매장 정보 또는 비밀번호가 올바르지 않습니다" |
| 주문 실패 | 인라인 에러 메시지: API 응답 메시지 표시, 장바구니 유지 |

---

## 7. localStorage 키 규약

| 키 | 값 타입 | 설명 |
|---|---|---|
| `table-order-credentials` | StoredCredentials (JSON) | 인증 정보 |
| `table-order-cart` | CartItem[] (JSON) | 장바구니 아이템 |
| `table-order-session` | string | 현재 세션 ID |
