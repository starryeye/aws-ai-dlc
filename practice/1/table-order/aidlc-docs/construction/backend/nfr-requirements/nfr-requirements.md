# Unit 1: Backend API - NFR 요구사항

---

## 1. 성능 요구사항 (PERF)

### PERF-01: API 응답 시간
| 구분 | 목표 | 비고 |
|---|---|---|
| 일반 REST API | 200ms 이내 | GET/POST/PATCH/DELETE |
| 주문 생성 (SSE 발행 포함) | 500ms 이내 | DB 저장 + SSE 이벤트 발행 |
| SSE 이벤트 전달 | 2초 이내 | 주문 생성 → 관리자 화면 표시 |
| 시드 데이터 초기화 | 5초 이내 | 애플리케이션 시작 시 |

### PERF-02: 처리량
| 항목 | 목표 |
|---|---|
| 동시 접속 | ~100명 (소규모) |
| 동시 SSE 연결 | ~10개 (매장당 관리자 1~2명) |
| 초당 주문 처리 | ~10건 (피크 시간대) |

### PERF-03: 데이터베이스 성능
- SQLite WAL 모드 활성화 (동시 읽기 성능 향상)
- 인덱스: storeId, sessionId, tableId, orderNumber, storeCode 등 주요 조회 컬럼
- 커넥션 풀: HikariCP 기본 설정 (최대 10개)

---

## 2. 보안 요구사항 (SEC)

### SEC-01: 인증/인가
- JWT HS256 서명, 16시간 만료
- 역할 기반 접근 제어 (TABLE/ADMIN)
- Spring Security 필터 체인으로 엔드포인트 보호
- 인증 불필요 경로: /api/auth/login

### SEC-02: 비밀번호 보호
- bcrypt 해싱 (BCryptPasswordEncoder)
- 로그인 시도 제한: 5회 실패 시 15분 잠금 (관리자만)

### SEC-03: 데이터 보호
- SQL Injection 방지: Spring Data JPA 파라미터 바인딩
- XSS 방지: 입력값 검증 및 이스케이프
- CORS: 개발 환경 모든 origin 허용 (localhost:*)

### SEC-04: API 보안
- PUT 메서드 미사용 (PATCH로 대체)
- 경로 변수 타입 검증 (양의 정수)
- 요청 본문 크기 제한 (기본 Spring Boot 설정)

---

## 3. 안정성 요구사항 (REL)

### REL-01: 에러 처리
- GlobalExceptionHandler로 전역 예외 처리
- 표준 에러 응답 형식 (error, message, timestamp)
- HTTP 상태 코드 일관성 (400/401/403/404/423/500)
- 예상치 못한 예외: 500 + 로그 기록

### REL-02: SSE 안정성
- 30분 타임아웃 후 클라이언트 자동 재연결
- 연결 해제 시 emitter 자동 정리 (onCompletion/onTimeout/onError)
- 이벤트 발행 실패 시 해당 emitter 제거 (silent fail)
- 구독자 없으면 이벤트 무시 (fire-and-forget)

### REL-03: 데이터 무결성
- JPA 트랜잭션 관리 (@Transactional)
- 주문 번호 동시성 처리 (매장별 순번 동기화)
- 테이블당 활성 세션 최대 1개 제약

### REL-04: 시드 데이터 멱등성
- 데이터 존재 여부 확인 후 스킵
- 애플리케이션 재시작 시 중복 생성 방지

---

## 4. 유지보수성 요구사항 (MAINT)

### MAINT-01: 로깅
- 로깅 프레임워크: SLF4J + Logback (Spring Boot 기본)
- 로깅 수준: 상세 (모든 API 요청/응답 + 비즈니스 이벤트)
- 로그 포함 항목:
  - 모든 HTTP 요청/응답 (메서드, 경로, 상태 코드, 소요 시간)
  - 비즈니스 이벤트 (주문 생성, 상태 변경, 세션 종료 등)
  - 인증 이벤트 (로그인 성공/실패, 토큰 검증)
  - SSE 이벤트 (구독, 발행, 연결 해제)
  - 에러/예외 (스택 트레이스 포함)
- 로그 형식: JSON 또는 구조화된 텍스트

### MAINT-02: 테스트
- 단위 테스트: JUnit 5
- Property-Based Testing: jqwik (전체 서비스 레이어)
  - AuthService: 토큰 생성/검증, 로그인 시도 제한
  - MenuService: 가격 검증, CRUD 일관성
  - OrderService: 금액 계산, 상태 전이, 주문 생성 검증
  - TableSessionService: 세션 생명주기, 이용 완료 처리
  - SseService: 이벤트 발행/구독 동작
- 테스트 커버리지 목표: 서비스 레이어 80% 이상

### MAINT-03: API 문서화
- SpringDoc OpenAPI 3.0 (Swagger UI)
- 자동 생성 + 어노테이션 기반 보강
- Swagger UI 경로: /swagger-ui.html
- API 스펙 경로: /v3/api-docs

### MAINT-04: 코드 구조
- Layered Architecture (Controller → Service → Repository)
- 패키지 구조: 기능별 분리 (auth, menu, order, table, sse, common)
- DTO와 Entity 분리 (매핑 레이어)

---

## 5. 확장성 요구사항 (SCALE)

### SCALE-01: 현재 규모
- 매장 수: 2~10개
- 매장당 테이블: 10개 이하
- 동시 접속: ~100명
- 단일 서버 인스턴스로 충분

### SCALE-02: 향후 확장 고려
- SQLite → PostgreSQL/MySQL 전환 가능한 JPA 추상화
- 매장별 데이터 격리 (storeId 기반 쿼리)
- SSE 매장별 emitter 관리 (향후 Redis Pub/Sub 전환 가능)

---

## 6. 배포 요구사항 (DEPLOY)

### DEPLOY-01: 컨테이너화
- Docker 기반 배포
- Dockerfile: 멀티스테이지 빌드 (빌드 + 런타임)
- 기본 포트: 8080

### DEPLOY-02: 환경 설정
- application.yml 기반 설정
- 환경 변수 오버라이드 지원
- 프로파일: default (개발), docker (Docker Compose)
