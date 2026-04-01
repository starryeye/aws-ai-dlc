# 테이블오더 서비스 - Units Generation 계획

## 계획 개요
Application Design에서 정의된 컴포넌트를 기반으로 개발 유닛(Unit of Work)으로 분해합니다.

시스템 구성상 사용자 요청에 따라 3개 유닛으로 분리:
- **Unit 1: Backend API** (Spring Boot + SQLite)
- **Unit 2: Customer Frontend** (React TypeScript - /table/*)
- **Unit 3: Admin Frontend** (React TypeScript - /admin/*)

---

## 질문

아래 질문에 답변해 주세요.

---

## Question 1
유닛 간 개발 순서는 어떻게 할까요?

A) 백엔드 먼저 완성 → 프론트엔드 개발 (API가 준비된 상태에서 프론트 개발)
B) 백엔드/프론트엔드 동시 개발 (API 명세 기반으로 병렬 진행)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
프론트엔드 상태 관리 방식은 어떤 것을 선호하시나요?

A) React Context API + useReducer (경량, 추가 라이브러리 없음)
B) Redux Toolkit (구조화된 상태 관리)
C) Zustand (간결한 API, 경량)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
프론트엔드 HTTP 클라이언트는 어떤 것을 선호하시나요?

A) Axios (인터셉터, 에러 핸들링 편리)
B) Fetch API (내장 API, 추가 라이브러리 없음)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## 생성 실행 계획

### Step 1: 유닛 정의
- [x] Unit 1 (Backend API) 정의: 범위, 책임, 기술 스택
- [x] Unit 2 (Customer Frontend) 정의: 범위, 책임, 기술 스택
- [x] Unit 3 (Admin Frontend) 정의: 범위, 책임, 기술 스택
- [x] `aidlc-docs/inception/application-design/unit-of-work.md` 생성

### Step 2: 유닛 의존성 정의
- [x] 유닛 간 의존성 매트릭스 생성
- [x] 통신 패턴 및 인터페이스 정의
- [x] `aidlc-docs/inception/application-design/unit-of-work-dependency.md` 생성

### Step 3: 스토리-유닛 매핑
- [x] 15개 사용자 스토리를 유닛에 매핑
- [x] 크로스 유닛 스토리 식별
- [x] `aidlc-docs/inception/application-design/unit-of-work-story-map.md` 생성

### Step 4: 검증
- [x] 모든 스토리가 유닛에 할당되었는지 확인
- [x] 유닛 경계 및 의존성 일관성 검증
