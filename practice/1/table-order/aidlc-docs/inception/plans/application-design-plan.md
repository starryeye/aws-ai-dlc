# 테이블오더 서비스 - Application Design 계획

## 계획 개요
요구사항과 사용자 스토리를 기반으로 애플리케이션 컴포넌트, 메서드, 서비스, 의존성을 설계합니다.

---

## 질문

아래 질문에 답변해 주세요. 각 `[Answer]:` 태그 뒤에 선택한 알파벳을 입력해 주세요.

---

## Question 1
백엔드 아키텍처 패턴은 어떤 것을 선호하시나요?

A) Layered Architecture (Controller → Service → Repository) - 전통적인 계층형
B) Hexagonal Architecture (Port & Adapter) - 도메인 중심 설계
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
프론트엔드 프로젝트 구조는 어떻게 할까요?

A) 단일 React 프로젝트 (고객용 + 관리자용을 라우팅으로 분리)
B) 별도 React 프로젝트 2개 (고객용 / 관리자용 각각 독립)
C) Other (please describe after [Answer]: tag below)

[Answer]: A (변경: B → A, 단일 프로젝트로 변경)

---

## Question 3
API 설계 스타일은 어떤 것을 선호하시나요?

A) RESTful API (리소스 기반 URL, HTTP 메서드 활용)
B) RPC 스타일 (동작 기반 URL)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
고객용 태블릿과 관리자용 화면의 인증 체계를 어떻게 분리할까요?

A) 동일한 인증 엔드포인트, 역할(role)로 구분 (TABLE / ADMIN)
B) 완전히 별도의 인증 엔드포인트 (/api/table/auth, /api/admin/auth)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
데이터베이스 접근 방식은 어떤 것을 선호하시나요?

A) Spring Data JPA (ORM 기반)
B) MyBatis (SQL 매퍼 기반)
C) Spring JDBC Template (직접 SQL)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## 생성 실행 계획

사용자 답변 승인 후 아래 순서로 실행합니다.

### Step 1: 컴포넌트 식별 및 정의
- [x] 백엔드 컴포넌트 식별 (Controller, Service, Repository 계층)
- [x] 프론트엔드 컴포넌트 식별 (페이지, 공통 컴포넌트)
- [x] `aidlc-docs/inception/application-design/components.md` 생성

### Step 2: 컴포넌트 메서드 정의
- [x] 각 컴포넌트의 메서드 시그니처 정의
- [x] 입출력 타입 정의
- [x] `aidlc-docs/inception/application-design/component-methods.md` 생성

### Step 3: 서비스 레이어 설계
- [x] 서비스 정의 및 책임 할당
- [x] 서비스 간 오케스트레이션 패턴 정의
- [x] `aidlc-docs/inception/application-design/services.md` 생성

### Step 4: 컴포넌트 의존성 정의
- [x] 의존성 매트릭스 생성
- [x] 통신 패턴 정의
- [x] `aidlc-docs/inception/application-design/component-dependency.md` 생성

### Step 5: 통합 문서 생성
- [x] 전체 설계를 통합하는 `aidlc-docs/inception/application-design/application-design.md` 생성
- [x] 설계 완전성 및 일관성 검증
