# Unit 1: Backend API - Functional Design 계획

## 계획 개요
Backend API(Spring Boot)의 상세 비즈니스 로직, 도메인 모델, 비즈니스 규칙을 설계합니다.
Application Design에서 정의된 컴포넌트/서비스/DTO를 기반으로 상세 설계를 진행합니다.

**담당 스토리**: US-01 ~ US-04, US-06 ~ US-15 (14개)

---

## 질문

아래 질문에 답변해 주세요.

---

## Question 1
주문 번호(orderNumber) 생성 규칙은 어떻게 할까요?

A) 순차 번호 (매장별 일일 리셋, 예: #001, #002, ...)
B) 타임스탬프 기반 (예: ORD-20260401-001)
C) UUID 기반 (고유성 보장, 예: 8자리 랜덤)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
주문 상태 변경 시 역방향 전이를 허용할까요? (예: 완료 → 준비중으로 되돌리기)

A) 불허 - 단방향만 허용 (PENDING → PREPARING → COMPLETED)
B) 허용 - 관리자가 자유롭게 상태 변경 가능
C) 부분 허용 - COMPLETED에서만 되돌리기 불가, 나머지는 자유
D) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 3
로그인 시도 제한 정책은 어떻게 할까요?

A) 5회 실패 시 15분 잠금
B) 3회 실패 시 30분 잠금
C) 10회 실패 시 1시간 잠금
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
테이블 세션 생성 시점은 언제로 할까요?

A) 테이블 태블릿 초기 설정(로그인) 시 즉시 세션 생성
B) 해당 테이블의 첫 주문 생성 시 세션 자동 생성
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
메뉴 삭제 시 해당 메뉴가 포함된 기존 주문은 어떻게 처리할까요?

A) 소프트 삭제 (deleted 플래그) - 기존 주문의 메뉴 참조 유지
B) 하드 삭제 - 주문 항목에 메뉴명/가격 스냅샷이 있으므로 문제 없음
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6
가격 범위 검증의 최소/최대 값은 어떻게 설정할까요?

A) 최소 100원 ~ 최대 1,000,000원
B) 최소 0원(무료 가능) ~ 최대 999,999원
C) 최소 1원 ~ 최대 10,000,000원
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 7
시드 데이터의 규모와 내용은 어떻게 할까요?

A) 최소 (매장 1개, 카테고리 3개, 메뉴 10개, 테이블 5개, 관리자 1명)
B) 중간 (매장 2개, 카테고리 5개, 메뉴 20개, 테이블 10개, 관리자 2명)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 8
SSE 연결 타임아웃은 어떻게 설정할까요?

A) 30분 타임아웃 후 클라이언트 자동 재연결
B) 1시간 타임아웃 후 클라이언트 자동 재연결
C) 타임아웃 없음 (서버 측 무제한, 클라이언트 끊김 시 자동 정리)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---


## 생성 실행 계획

### Step 1: 도메인 엔티티 설계
- [x] Store 엔티티 상세 정의 (필드, 제약조건, 관계)
- [x] StoreUser 엔티티 상세 정의 (관리자 계정)
- [x] Table 엔티티 상세 정의
- [x] MenuCategory 엔티티 상세 정의
- [x] MenuItem 엔티티 상세 정의
- [x] Order 엔티티 상세 정의
- [x] OrderItem 엔티티 상세 정의
- [x] TableSession 엔티티 상세 정의
- [x] OrderHistory 엔티티 상세 정의
- [x] 엔티티 간 관계(ER) 다이어그램 작성
- [x] `aidlc-docs/construction/backend/functional-design/domain-entities.md` 생성

### Step 2: 비즈니스 로직 모델 설계
- [x] 인증 플로우 상세 설계 (테이블 로그인, 관리자 로그인, JWT 발급/검증)
- [x] 주문 생성 플로우 상세 설계 (검증 → 저장 → SSE 발행)
- [x] 주문 상태 변경 플로우 상세 설계
- [x] 주문 삭제 플로우 상세 설계 (총액 재계산 포함)
- [x] 테이블 세션 관리 플로우 상세 설계 (생성, 종료, 이력 이동)
- [x] 메뉴 CRUD 플로우 상세 설계
- [x] SSE 이벤트 발행/구독 플로우 상세 설계
- [x] `aidlc-docs/construction/backend/functional-design/business-logic-model.md` 생성

### Step 3: 비즈니스 규칙 정의
- [x] 인증 규칙 (JWT 만료, 로그인 시도 제한, 역할 기반 접근 제어)
- [x] 주문 규칙 (최소 1개 항목, 활성 세션 필수, 상태 전이 규칙)
- [x] 메뉴 규칙 (필수 필드, 가격 범위, 순서 관리)
- [x] 세션 규칙 (16시간 만료, 이용 완료 조건)
- [x] 데이터 검증 규칙 (입력값 검증, 비즈니스 제약)
- [x] `aidlc-docs/construction/backend/functional-design/business-rules.md` 생성

### Step 4: 검증
- [x] 모든 스토리(14개)의 비즈니스 로직이 커버되었는지 확인
- [x] 비즈니스 규칙 간 모순 없는지 검증
- [x] 도메인 엔티티와 DTO 간 매핑 일관성 확인
