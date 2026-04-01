# Build and Test Summary - 통합 (All Units)

## Unit 1: Backend API

### 빌드 정보
| 항목 | 값 |
|---|---|
| 빌드 도구 | Gradle 8.x |
| 빌드 명령 | `./gradlew clean build` |
| 빌드 아티팩트 | `build/libs/table-order-backend-0.0.1-SNAPSHOT.jar` |
| Docker 이미지 | `eclipse-temurin:17-jre-alpine` |

### 단위 테스트 (PBT)
| 테스트 | 대상 | 속성 수 |
|---|---|---|
| AuthServicePBTTest | 인증 | 3개 |
| MenuServicePBTTest | 메뉴 | 4개 |
| OrderServicePBTTest | 주문 | 5개 |
| TableSessionServicePBTTest | 세션 | 3개 |
| SseServicePBTTest | SSE | 2개 |
| **합계** | | **17개 속성** |

### 통합 테스트
| 시나리오 | 설명 |
|---|---|
| 고객 주문 플로우 | 로그인 → 메뉴 조회 → 주문 생성 |
| 관리자 주문 관리 | 로그인 → 주문 조회 → 상태 변경 |
| SSE 실시간 통신 | 구독 → 주문 생성 → 이벤트 수신 |
| 테이블 이용 완료 | 이용 완료 → 이력 이동 → 과거 내역 조회 |

### 성능 테스트
| 항목 | 목표 |
|---|---|
| REST API 응답 | 200ms 이내 |
| SSE 이벤트 전달 | 2초 이내 |

---

## Unit 2 + Unit 3: Frontend (Customer + Admin)

### 빌드 정보
| 항목 | 값 |
|---|---|
| 빌드 도구 | Vite 5.x + TypeScript 5.x |
| 빌드 명령 | `npm run build` |
| 빌드 아티팩트 | `dist/index.html`, `dist/assets/*.js`, `dist/assets/*.css` |
| Docker 이미지 | `node:20-alpine` → `nginx:alpine` |

### Unit 3 단위 테스트 (Example-Based)
| 파일 | 테스트 수 | 설명 |
|---|---|---|
| authReducer.test.ts | 3 | LOGIN, LOGOUT, TOKEN_EXPIRED |
| orderReducer.test.ts | 5 | SET, ADD, UPDATE, REMOVE, RESET |
| menuReducer.test.ts | 4 | SET, ADD, UPDATE, REMOVE |

### Unit 3 PBT 테스트
| 파일 | 테스트 수 | 설명 |
|---|---|---|
| orderReducer.pbt.test.ts | 4 | SET_ORDERS invariant, ADD_ORDER count, UPDATE idempotence, REMOVE count |
| menuReducer.pbt.test.ts | 3 | ADD count, REORDER preserve, REMOVE count |
| validation.pbt.test.ts | 3 | valid no errors, empty name error, negative price error |

### Unit 3 통합 테스트
| 시나리오 | 설명 |
|---|---|
| 관리자 로그인 | 로그인 → 대시보드 리다이렉트 |
| SSE 실시간 수신 | 주문 생성 → 대시보드 반영 |
| 주문 상태 변경 | 상태 드롭다운 → 즉시 반영 |
| 테이블 이용 완료 | 이용 완료 → 주문 리셋 |
| 메뉴 CRUD | 등록/수정/삭제 전체 플로우 |

### PBT Compliance Summary
| Rule | Status | Notes |
|---|---|---|
| PBT-01 | ✅ Compliant | 8개 속성 식별 (Functional Design) |
| PBT-02 | N/A | 프론트엔드 직렬화 round-trip 해당 없음 |
| PBT-03 | ✅ Compliant | Invariant 테스트 (count, totalAmount) |
| PBT-04 | ✅ Compliant | Idempotence 테스트 (UPDATE_ORDER_STATUS) |
| PBT-05 | N/A | Oracle 없음 |
| PBT-06 | N/A | Stateful PBT → reducer 테스트로 커버 |
| PBT-07 | ✅ Compliant | 도메인 제너레이터 (orderArb, menuItemArb) |
| PBT-08 | ✅ Compliant | seed: 42, shrinking 활성화 |
| PBT-09 | ✅ Compliant | fast-check 3.x 선정 |
| PBT-10 | ✅ Compliant | PBT + Example-Based 분리 |

---

## Overall Status
- **Backend Build**: ✅ Ready
- **Frontend Build**: ✅ Ready
- **Backend Unit Tests**: ✅ Ready (17 PBT properties)
- **Frontend Unit Tests**: ✅ Ready (22 tests)
- **Integration Tests**: ⏳ 전체 시스템 통합 후 실행

## Execution Commands
```bash
# Backend
cd backend
./gradlew clean build
./gradlew bootRun

# Frontend
cd frontend
npm install
npm run build
npm run test
npm run dev

# Docker Compose (전체 시스템)
docker-compose up --build
```
