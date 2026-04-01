# Unit 1: Backend API - NFR Requirements 계획

## 계획 개요
Backend API의 비기능 요구사항(성능, 보안, 안정성 등)을 정의하고 기술 스택 세부 결정을 진행합니다.
Functional Design에서 정의된 비즈니스 로직을 기반으로 NFR을 구체화합니다.

---

## 질문

아래 질문에 답변해 주세요.

---

## Question 1
API 응답 시간 목표는 어떻게 설정할까요?

A) 일반 API 200ms 이내, SSE 이벤트 전달 2초 이내
B) 일반 API 500ms 이내, SSE 이벤트 전달 3초 이내
C) 특별한 목표 없음 (합리적 수준이면 충분)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
로깅 수준은 어떻게 할까요?

A) 기본 (에러 + 주요 비즈니스 이벤트만)
B) 상세 (모든 API 요청/응답 + 비즈니스 이벤트)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 3
CORS(Cross-Origin Resource Sharing) 정책은 어떻게 할까요?

A) 개발 환경 전용 - 모든 origin 허용 (localhost:*)
B) 특정 도메인만 허용 (프론트엔드 도메인 지정)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
데이터베이스 마이그레이션 전략은 어떻게 할까요?

A) JPA auto-ddl (create/update) - 개발 환경 간편 설정
B) Flyway/Liquibase 마이그레이션 도구 사용
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
Property-Based Testing(PBT) 적용 범위는 어떻게 할까요?

A) 핵심 비즈니스 로직만 (주문 금액 계산, 상태 전이, 세션 관리)
B) 전체 서비스 레이어 (인증, 메뉴, 주문, 세션, SSE 모두)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 6
API 문서화는 어떻게 할까요?

A) SpringDoc OpenAPI (Swagger UI 자동 생성)
B) 별도 문서화 없음 (component-methods.md로 충분)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---


## 생성 실행 계획

### Step 1: NFR 요구사항 정의
- [x] 성능 요구사항 정의 (응답 시간, 처리량)
- [x] 보안 요구사항 정의 (인증, 데이터 보호)
- [x] 안정성 요구사항 정의 (에러 처리, SSE 복구)
- [x] 유지보수성 요구사항 정의 (로깅, 테스트, 문서화)
- [x] `aidlc-docs/construction/backend/nfr-requirements/nfr-requirements.md` 생성

### Step 2: 기술 스택 세부 결정
- [x] Spring Boot 버전 및 의존성 결정
- [x] SQLite 연동 라이브러리 결정
- [x] JWT 라이브러리 결정
- [x] PBT 프레임워크(jqwik) 설정 결정
- [x] 빌드 도구(Gradle) 설정 결정
- [x] `aidlc-docs/construction/backend/nfr-requirements/tech-stack-decisions.md` 생성

### Step 3: 검증
- [x] NFR 요구사항과 Functional Design 간 일관성 확인
- [x] 기술 스택 결정과 요구사항 간 적합성 검증
