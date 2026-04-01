# Unit 1: Backend API - 비즈니스 규칙

---

## 1. 인증 규칙 (AUTH)

### AUTH-01: JWT 토큰 정책
- 만료 시간: 16시간 (57,600초)
- 서명 알고리즘: HS256
- Claims: storeId, role, tableId(TABLE만), userId(ADMIN만), sessionId(TABLE만)
- 토큰 위치: Authorization 헤더 (Bearer 스킴)

### AUTH-02: 로그인 시도 제한 (관리자만)
- 최대 연속 실패: 5회
- 잠금 시간: 15분
- 잠금 해제: lockedUntil 시각 경과 후 자동 해제
- 성공 시: loginAttempts = 0, lockedUntil = null 초기화
- 적용 대상: StoreUser (관리자) 계정만
- 테이블 로그인: 시도 제한 미적용 (물리적 접근 제어)

### AUTH-03: 역할 기반 접근 제어 (RBAC)
| 리소스 | TABLE | ADMIN |
|---|---|---|
| POST /api/auth/login | ✅ | ✅ |
| GET /api/auth/validate | ✅ | ✅ |
| GET /categories, /menus | ✅ | ✅ |
| POST /orders (주문 생성) | ✅ | ❌ |
| GET /orders (세션별) | ✅ | ❌ |
| GET /orders/all | ❌ | ✅ |
| PATCH /orders/{id}/status | ❌ | ✅ |
| DELETE /orders/{id} | ❌ | ✅ |
| POST,PATCH,DELETE /menus | ❌ | ✅ |
| GET /tables | ❌ | ✅ |
| POST /tables/{id}/complete | ❌ | ✅ |
| GET /tables/{id}/history | ❌ | ✅ |
| GET /sse/orders | ❌ | ✅ |

### AUTH-04: 비밀번호 정책
- 해싱: bcrypt (Spring Security BCryptPasswordEncoder)
- 최소 길이: 제한 없음 (MVP)
- 시드 데이터 비밀번호: 평문 저장 후 DataInitializer에서 bcrypt 해싱

---

## 2. 주문 규칙 (ORD)

### ORD-01: 주문 생성 조건
- 최소 1개 이상의 주문 항목 필수
- 활성 세션(active=true, expiresAt > now) 필수
- 각 항목의 quantity >= 1
- 각 항목의 unitPrice >= 0

### ORD-02: 주문 번호 생성
- 형식: `ORD-{yyyyMMdd}-{NNN}`
- NNN: 매장별 당일 순번 (001부터, 3자리 zero-padding)
- 예시: ORD-20260401-001, ORD-20260401-002
- 일일 리셋: 날짜 변경 시 001부터 재시작
- 동시성: 매장별 순번 조회 시 동기화 필요

### ORD-03: 주문 상태 전이 규칙
```
PENDING ──→ PREPARING ──→ COMPLETED
   |              |
   |              ↓
   +──→ COMPLETED (직접 전이 허용)
   ↑
   |
PREPARING (역방향 허용: PREPARING → PENDING)
```

허용 전이 매트릭스:
| From \ To | PENDING | PREPARING | COMPLETED |
|---|---|---|---|
| PENDING | ❌ (동일) | ✅ | ✅ |
| PREPARING | ✅ (역방향) | ❌ (동일) | ✅ |
| COMPLETED | ❌ | ❌ | ❌ (동일) |

- COMPLETED 상태에서는 어떤 상태로도 변경 불가
- 동일 상태로의 변경 시도 → 400 Bad Request

### ORD-04: 주문 금액 계산
- 항목 소계: subtotal = quantity × unitPrice
- 총 금액: totalAmount = SUM(subtotal)
- 금액 단위: 원 (정수, BigDecimal scale=0)
- 메뉴명/단가는 주문 시점 스냅샷 (메뉴 변경 영향 없음)

### ORD-05: 주문 삭제
- ADMIN 역할만 가능
- 하드 삭제 (Order + OrderItem 물리 삭제)
- 삭제 후 SSE 이벤트 발행 (ORDER_DELETED)

---

## 3. 메뉴 규칙 (MENU)

### MENU-01: 필수 필드 검증
| 필드 | 필수 | 검증 규칙 |
|---|---|---|
| name | Y | 비어있지 않음, 최대 100자 |
| price | Y | 0 이상, 999,999 이하 (BigDecimal) |
| categoryId | Y | 존재하는 카테고리 ID |
| description | N | 최대 500자 |
| imageUrl | N | 최대 500자 |
| displayOrder | N | 기본값 0, 정수 |

### MENU-02: 소프트 삭제 정책
- 삭제 시 deleted = true 설정 (물리 삭제 아님)
- 조회 시 deleted = false 조건 필터링
- 기존 주문의 menuId 참조는 유지됨 (FK 무결성 보장)
- 삭제된 메뉴는 관리자 메뉴 목록에서도 미표시

### MENU-03: 순서 관리
- displayOrder 값으로 정렬 (오름차순)
- 동일 displayOrder 시 id 오름차순
- 순서 변경 API는 일괄 업데이트 (부분 변경 가능)

---

## 4. 세션 규칙 (SESSION)

### SESSION-01: 세션 생성
- 테이블 로그인 성공 시 즉시 세션 생성
- 기존 활성 세션이 있으면 재사용 (만료되지 않은 경우)
- 만료된 세션은 자동 종료 후 새 세션 생성
- sessionUuid: UUID v4 (36자)

### SESSION-02: 세션 만료
- 만료 시간: 시작 시각 + 16시간
- 만료 확인: 주문 생성 시, 로그인 시
- 만료된 세션: active=false 처리 (자동)
- 만료 시 수동 종료만 가능 (관리자 이용 완료)

### SESSION-03: 이용 완료 (세션 종료)
- 관리자만 실행 가능
- 처리 순서:
  1. 현재 세션 주문 → OrderHistory로 이동
  2. 현재 세션 OrderItem 삭제
  3. 현재 세션 Order 삭제
  4. 세션 active=false, completedAt=now
- 활성 세션이 없으면 400 에러
- 종료 후 새 로그인 시 새 세션 자동 생성

### SESSION-04: 테이블당 활성 세션
- 테이블당 최대 1개의 활성 세션만 허용
- 새 세션 생성 전 기존 활성 세션 확인 필수

---

## 5. 데이터 검증 규칙 (VALID)

### VALID-01: 공통 입력 검증
- storeId: 양의 정수, 존재하는 매장
- 문자열 필드: 앞뒤 공백 제거 (trim)
- NULL 허용 필드: 명시적으로 NULLABLE 표기된 필드만

### VALID-02: 경로 변수 검증
- {storeId}: 양의 정수
- {menuId}: 양의 정수
- {orderId}: 양의 정수
- {tableId}: 양의 정수
- 잘못된 형식 → 400 Bad Request

### VALID-03: 날짜 파라미터 검증
- dateFrom, dateTo: ISO 8601 날짜 형식 (yyyy-MM-dd)
- dateFrom > dateTo → 400 Bad Request
- 미제공 시 전체 조회

---

## 6. SSE 규칙 (SSE)

### SSE-01: 연결 관리
- 타임아웃: 30분 (1,800,000ms)
- 타임아웃 후 클라이언트 자동 재연결 (EventSource 기본 동작)
- 매장별 emitter 관리 (ConcurrentHashMap)
- 연결 해제 시 자동 정리 (onCompletion, onTimeout, onError)

### SSE-02: 이벤트 발행
- 이벤트명: orderEvent
- 데이터 형식: JSON (OrderEvent)
- 발행 실패 시 해당 emitter 제거 (silent fail)
- 구독자 없으면 이벤트 무시 (fire-and-forget)

### SSE-03: 초기 연결
- 구독 성공 시 connected 이벤트 전송
- 클라이언트는 connected 이벤트로 연결 상태 확인

---

## 7. 시드 데이터 규칙 (SEED)

### SEED-01: 초기 데이터 구성
| 항목 | 수량 | 비고 |
|---|---|---|
| 매장 | 2개 | storeCode: STORE001, STORE002 |
| 관리자 | 매장당 1명 (총 2명) | username: admin |
| 카테고리 | 매장당 약 5개 | 메인, 사이드, 음료, 디저트, 주류 등 |
| 메뉴 | 매장당 약 10개 (총 20개) | 카테고리별 분배 |
| 테이블 | 매장당 5개 (총 10개) | tableNumber: T01~T05 |

### SEED-02: 실행 조건
- 애플리케이션 시작 시 실행 (ApplicationRunner 또는 CommandLineRunner)
- 데이터가 이미 존재하면 스킵 (멱등성 보장)
- 비밀번호: bcrypt 해싱하여 저장

---

## 8. 에러 응답 규칙 (ERR)

### ERR-01: 표준 에러 응답 형식
```json
{
  "error": "ERROR_CODE",
  "message": "사용자 친화적 메시지",
  "timestamp": "2026-04-01T12:00:00Z"
}
```

### ERR-02: HTTP 상태 코드 매핑
| 상태 코드 | 용도 |
|---|---|
| 200 | 성공 (조회, 수정) |
| 201 | 생성 성공 (주문, 메뉴) |
| 204 | 삭제 성공 |
| 400 | 입력 검증 실패, 비즈니스 규칙 위반 |
| 401 | 인증 실패 (잘못된 비밀번호, 만료된 토큰) |
| 403 | 권한 없음 (역할 불일치) |
| 404 | 리소스 없음 |
| 423 | 계정 잠금 |
| 500 | 서버 내부 오류 |
