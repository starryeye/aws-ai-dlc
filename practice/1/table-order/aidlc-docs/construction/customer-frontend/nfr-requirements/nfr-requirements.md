# Unit 2: Customer Frontend - 비기능 요구사항 (NFR)

---

## 1. 성능 요구사항

| NFR ID | 항목 | 요구사항 | 비고 |
|---|---|---|---|
| PERF-01 | 초기 로드 | MVP 우선, 별도 성능 최적화 목표 없음 | 추후 개선 가능 |
| PERF-02 | 이미지 최적화 | lazy loading 적용 | 메뉴 이미지는 외부 URL, `loading="lazy"` 속성 사용 |
| PERF-03 | 클라이언트 필터링 | 카테고리 필터링은 클라이언트 사이드 | 전체 메뉴를 한 번에 로드 후 필터 |

---

## 2. 사용성 요구사항

| NFR ID | 항목 | 요구사항 | 비고 |
|---|---|---|---|
| UX-01 | 반응형 디자인 | 태블릿 + 모바일 지원 (320px~1024px) | Tailwind 반응형 유틸리티 활용 |
| UX-02 | 테마 | 라이트모드만 지원 | 다크모드 미지원 |
| UX-03 | 터치 친화성 | 최소 터치 영역 44x44px | 요구사항 명세 준수 |
| UX-04 | 로딩 피드백 | 스켈레톤 UI (MenuPage, OrderHistoryPage) | 데이터 로딩 중 시각적 피드백 |
| UX-05 | 에러 피드백 | 인라인 에러 메시지 | 모달/토스트 대신 인라인 표시 |

---

## 3. 신뢰성 요구사항

| NFR ID | 항목 | 요구사항 | 비고 |
|---|---|---|---|
| REL-01 | localStorage 손상 처리 | 자동 초기화 후 SetupPage 이동 | JSON.parse 실패 또는 필수 필드 누락 시 |
| REL-02 | API 재시도 | 재시도 없음 (사용자 직접 재시도) | MVP 단순화 |
| REL-03 | 이중 클릭 방지 | 주문 확정 버튼 즉시 비활성화 | isSubmitting 상태로 제어 |
| REL-04 | 401 자동 처리 | Axios 인터셉터로 자동 로그아웃 | localStorage 클리어 → SetupPage |
| REL-05 | 장바구니 영속성 | localStorage 저장, 새로고침 시 유지 | 주문 성공 시에만 클리어 |

### localStorage 손상 처리 상세

localStorage에 저장되는 3개 키에 대해 동일한 방어 로직 적용:

| 키 | 손상 시 처리 |
|---|---|
| `table-order-credentials` | JSON.parse 실패 또는 필수 필드(token, storeId, tableId) 누락 → 전체 localStorage 클리어 → SetupPage 이동 |
| `table-order-session` | 값이 빈 문자열이거나 없음 → SetupPage 이동 |
| `table-order-cart` | JSON.parse 실패 또는 배열이 아님 → 장바구니만 빈 배열로 초기화 (인증 정보는 유지) |

---

## 4. 보안 요구사항

| NFR ID | 항목 | 요구사항 | 비고 |
|---|---|---|---|
| SEC-01 | 토큰 저장 | localStorage에 JWT 저장 | MVP 범위, HttpOnly 쿠키 미사용 |
| SEC-02 | API 인증 | Authorization: Bearer 헤더 자동 첨부 | Axios 인터셉터 |
| SEC-03 | 입력 검증 | 클라이언트 사이드 필수 필드 검증 | XSS 방어는 React 기본 이스케이핑에 의존 |

---

## 5. 유지보수성 요구사항

| NFR ID | 항목 | 요구사항 | 비고 |
|---|---|---|---|
| MAINT-01 | 코드 구조 | 페이지/컴포넌트/컨텍스트/API 레이어 분리 | 관심사 분리 |
| MAINT-02 | 타입 안전성 | TypeScript strict 모드 | 컴파일 타임 에러 검출 |
| MAINT-03 | API 레이어 | Axios 인스턴스 중앙 관리 | 인터셉터, baseURL 등 일원화 |
