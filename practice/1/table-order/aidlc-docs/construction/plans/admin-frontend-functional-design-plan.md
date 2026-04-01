# Unit 3: Admin Frontend - Functional Design 계획

## 유닛 개요
- **유닛**: Unit 3 - Admin Frontend (/admin/*)
- **담당 스토리**: US-08 ~ US-15 (8개)
- **기술**: React TypeScript, Context API + useReducer, Axios, EventSource (SSE)

---

## 질문

---

## Question 1
관리자 대시보드의 테이블 카드 그리드 레이아웃은 어떤 형태를 선호하시나요?

A) 고정 컬럼 수 (예: 3열 또는 4열 고정)
B) 반응형 그리드 (화면 크기에 따라 컬럼 수 자동 조절)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
주문 상태 변경 UI는 어떤 형태를 선호하시나요?

A) 버튼 클릭으로 다음 상태로 순차 변경 (대기중 → 준비중 → 완료)
B) 드롭다운으로 원하는 상태 직접 선택
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 3
관리자 네비게이션 구조는 어떤 형태를 선호하시나요?

A) 상단 탭 네비게이션 (대시보드 / 테이블 관리 / 메뉴 관리)
B) 좌측 사이드바 네비게이션
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 4
메뉴 관리 페이지에서 메뉴 등록/수정 UI는 어떤 형태를 선호하시나요?

A) 모달(팝업) 형태의 폼
B) 별도 페이지로 이동하는 폼
C) 인라인 편집 (목록에서 직접 수정)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
CSS 스타일링 방식은 어떤 것을 선호하시나요?

A) Tailwind CSS (유틸리티 클래스 기반)
B) CSS Modules (컴포넌트별 스코프 CSS)
C) styled-components (CSS-in-JS)
D) 일반 CSS/SCSS
E) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## 생성 실행 계획

### Step 1: 비즈니스 로직 모델
- [x] 관리자 인증 플로우 상세 설계
- [x] 실시간 주문 모니터링 상태 관리 설계
- [x] 테이블 관리 플로우 설계 (주문 삭제, 이용 완료, 과거 내역)
- [x] 메뉴 관리 CRUD 플로우 설계

### Step 2: 비즈니스 규칙
- [x] 인증 규칙 (토큰 만료, 자동 로그아웃)
- [x] 주문 상태 전이 규칙
- [x] 메뉴 입력 검증 규칙
- [x] SSE 연결 관리 규칙

### Step 3: 프론트엔드 컴포넌트 상세
- [x] 페이지별 컴포넌트 계층 구조
- [x] Props/State 정의
- [x] API 연동 포인트
- [x] 사용자 인터랙션 플로우

### Step 4: PBT 속성 식별 (PBT-01)
- [x] 테스트 가능한 속성 식별
- [x] 속성 카테고리 매핑
