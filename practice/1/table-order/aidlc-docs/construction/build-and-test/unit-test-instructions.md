# Unit Test Execution - 통합 (All Units)

---

## Unit 1: Backend API

### 전체 테스트 실행
```bash
cd backend
./gradlew test
```

### 테스트 목록 (JUnit 5 + jqwik PBT)
| 테스트 클래스 | 대상 | 유형 |
|---|---|---|
| AuthServicePBTTest | 인증 (잠금 정책, 토큰 왕복) | PBT |
| MenuServicePBTTest | 메뉴 (가격 범위, 소프트 삭제) | PBT |
| OrderServicePBTTest | 주문 (금액 계산, 상태 전이, 주문번호) | PBT |
| TableSessionServicePBTTest | 세션 (생명주기, 이용 완료) | PBT |
| SseServicePBTTest | SSE (이벤트 유형, 구독자 없음 처리) | PBT |

### 테스트 결과 확인
```bash
open backend/build/reports/tests/test/index.html
./gradlew test --info
```

### 개별 테스트 실행
```bash
./gradlew test --tests "com.tableorder.order.OrderServicePBTTest"
./gradlew test --tests "com.tableorder.auth.*"
```

---

## Unit 3: Admin Frontend

### 전체 테스트 실행
```bash
cd frontend
npm run test
# 또는
npx vitest --run
```

### PBT 테스트만 실행
```bash
npx vitest --run --reporter=verbose src/admin/__tests__/*.pbt.test.ts
```

### Example-Based 테스트만 실행
```bash
npx vitest --run --reporter=verbose src/admin/__tests__/*.test.ts --exclude='**/*.pbt.test.ts'
```

### 테스트 목록

#### PBT Tests (3 files, 10 tests)
| 파일 | 테스트 수 | 설명 |
|---|---|---|
| orderReducer.pbt.test.ts | 4 | SET_ORDERS invariant, ADD_ORDER count, UPDATE idempotence, REMOVE count |
| menuReducer.pbt.test.ts | 3 | ADD count, REORDER preserve, REMOVE count |
| validation.pbt.test.ts | 3 | valid no errors, empty name error, negative price error |

#### Example-Based Tests (3 files, 12 tests)
| 파일 | 테스트 수 | 설명 |
|---|---|---|
| authReducer.test.ts | 3 | LOGIN, LOGOUT, TOKEN_EXPIRED |
| orderReducer.test.ts | 5 | SET, ADD, UPDATE, REMOVE, RESET |
| menuReducer.test.ts | 4 | SET, ADD, UPDATE, REMOVE |

### PBT Configuration (PBT-08)
- **Seed**: 42 (고정 시드로 재현성 보장)
- **Shrinking**: 활성화 (fast-check 기본값)
- **numRuns**: 50~200 (테스트별 설정)

---

## 기대 결과
- Backend: 17개 PBT 속성 전체 통과
- Frontend: 22개 테스트 전체 통과
