# Unit 1: Backend API - Code Generation 계획

## 유닛 컨텍스트
- **유닛**: Unit 1 - Backend API (Spring Boot 3.3.x, Java 17, SQLite)
- **담당 스토리**: US-01~US-04, US-06~US-15 (14개)
- **의존성**: 없음 (백엔드는 프론트엔드에 의존하지 않음)
- **패키지 루트**: `com.tableorder`
- **코드 위치**: `backend/` (워크스페이스 루트 하위)

## 스토리 매핑
| Step | 관련 스토리 |
|---|---|
| Step 1 (프로젝트 구조) | 전체 |
| Step 2 (엔티티/리포지토리) | 전체 |
| Step 3 (인증) | US-01, US-02, US-08 |
| Step 4 (메뉴) | US-03, US-04, US-14, US-15 |
| Step 5 (주문) | US-06, US-07, US-09, US-10, US-11 |
| Step 6 (테이블/세션) | US-01, US-12, US-13 |
| Step 7 (SSE) | US-09 |
| Step 8 (공통/설정) | 전체 |
| Step 9 (시드 데이터) | 전체 |
| Step 10 (PBT 테스트) | 전체 |
| Step 11 (배포 아티팩트) | 전체 |
| Step 12 (문서 요약) | 전체 |

---

## 실행 계획

### Step 1: 프로젝트 구조 및 빌드 설정
- [x] Gradle 프로젝트 초기화 (build.gradle, settings.gradle)
- [x] 패키지 구조 생성 (auth, menu, order, table, sse, common)
- [x] application.yml, application-docker.yml 생성
- [x] gradlew 래퍼 설정

### Step 2: 도메인 엔티티 및 리포지토리
- [x] Store, StoreUser 엔티티 + 리포지토리
- [x] TableEntity, TableSession 엔티티 + 리포지토리
- [x] MenuCategory, MenuItem 엔티티 + 리포지토리
- [x] Order, OrderItem 엔티티 + 리포지토리
- [x] OrderHistory 엔티티 + 리포지토리
- [x] DTO 클래스 (Request/Response 전체)

### Step 3: 인증 모듈 (US-01, US-02, US-08)
- [x] JwtTokenProvider (토큰 생성/검증/파싱)
- [x] SecurityConfig (필터 체인, CORS, 인증 제외 경로)
- [x] JwtAuthenticationFilter (요청별 토큰 검증)
- [x] AuthService (authenticate, validateToken, checkLoginAttempts)
- [x] AuthController (login, validateToken)
- [x] 인증 단위 테스트

### Step 4: 메뉴 모듈 (US-03, US-04, US-14, US-15)
- [x] MenuService (getCategories, getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, updateMenuOrder)
- [x] MenuController (REST 엔드포인트 7개)
- [x] 메뉴 단위 테스트

### Step 5: 주문 모듈 (US-06, US-07, US-09, US-10, US-11)
- [x] OrderService (createOrder, getOrdersBySession, getActiveOrdersByStore, updateOrderStatus, deleteOrder, calculateTableTotal)
- [x] OrderController (REST 엔드포인트 5개)
- [x] 주문 단위 테스트

### Step 6: 테이블/세션 모듈 (US-01, US-12, US-13)
- [x] TableSessionService (getOrCreateSession, completeSession, getTableHistory, isSessionActive)
- [x] TableController (getTables, getTableSummary, completeTable, getTableHistory)
- [x] 테이블/세션 단위 테스트

### Step 7: SSE 모듈 (US-09)
- [x] SseService (subscribe, publishOrderEvent, removeEmitter)
- [x] SseController (subscribe 엔드포인트)
- [x] SSE 단위 테스트

### Step 8: 공통 모듈 및 설정
- [x] GlobalExceptionHandler (전역 예외 처리)
- [x] ErrorResponse DTO
- [x] 요청 로깅 필터 (RequestLoggingFilter)
- [x] SpringDoc OpenAPI 설정
- [x] SQLite Dialect 설정 (필요 시)

### Step 9: 시드 데이터 초기화
- [x] DataInitializer (CommandLineRunner)
- [x] 매장 2개, 관리자 2명, 카테고리 10개, 메뉴 20개, 테이블 10개 시드 데이터

### Step 10: Property-Based Testing (jqwik)
- [x] AuthService PBT (토큰 왕복, 잠금 정책)
- [x] MenuService PBT (가격 범위, CRUD 일관성, 소프트 삭제)
- [x] OrderService PBT (금액 계산, 상태 전이, 주문번호 유일성)
- [x] TableSessionService PBT (세션 생명주기, 이용 완료)
- [x] SseService PBT (이벤트 발행/구독)

### Step 11: 배포 아티팩트
- [x] Dockerfile (멀티스테이지 빌드)
- [x] docker-compose.yml (백엔드 서비스)
- [x] .dockerignore

### Step 12: 문서 요약
- [x] `aidlc-docs/construction/backend/code/code-generation-summary.md` 생성
- [x] 생성된 파일 목록 및 스토리 커버리지 정리
