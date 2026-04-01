# Integration Test Instructions - 통합 (All Units)

## 목적
전체 시스템(Backend + Customer Frontend + Admin Frontend) 간의 통합을 검증합니다.

## 테스트 환경 설정

### 1. 백엔드 서버 시작
```bash
cd backend
./gradlew bootRun
```

### 2. 프론트엔드 개발 서버 시작
```bash
cd frontend
npm run dev
```

### 3. 시드 데이터 확인
서버 시작 시 자동으로 시드 데이터가 생성됩니다:
- 매장: STORE001 (맛있는 식당), STORE002 (행복한 카페)
- 관리자: admin / admin123
- 테이블: T01~T05 / table1~table5

---

## Backend API 통합 테스트

### 시나리오 1: 고객 주문 플로우
1. 테이블 로그인
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"storeCode":"STORE001","username":"T01","password":"table1","role":"TABLE"}'
```
2. 토큰으로 메뉴 조회
```bash
curl http://localhost:8080/api/stores/1/categories
curl http://localhost:8080/api/stores/1/menus
```
3. 주문 생성 (Bearer 토큰 필요)
```bash
curl -X POST http://localhost:8080/api/stores/1/orders \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"tableId":1,"sessionId":"{SESSION_UUID}","items":[{"menuId":1,"menuName":"김치찌개","quantity":2,"unitPrice":8000}]}'
```

### 시나리오 2: 관리자 주문 관리 플로우
1. 관리자 로그인
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"storeCode":"STORE001","username":"admin","password":"admin123","role":"ADMIN"}'
```
2. 전체 주문 조회
```bash
curl http://localhost:8080/api/stores/1/orders/all \
  -H "Authorization: Bearer {ADMIN_TOKEN}"
```
3. 주문 상태 변경
```bash
curl -X PATCH http://localhost:8080/api/stores/1/orders/{orderId}/status \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"status":"PREPARING"}'
```

### 시나리오 3: SSE 실시간 통신
1. 관리자 SSE 구독 (별도 터미널)
```bash
curl -N http://localhost:8080/api/stores/1/sse/orders \
  -H "Authorization: Bearer {ADMIN_TOKEN}"
```
2. 고객이 주문 생성 → SSE로 실시간 수신 확인

### 시나리오 4: 테이블 이용 완료
1. 이용 완료 처리
```bash
curl -X POST http://localhost:8080/api/stores/1/tables/1/complete \
  -H "Authorization: Bearer {ADMIN_TOKEN}"
```
2. 과거 내역 조회
```bash
curl http://localhost:8080/api/stores/1/tables/1/history \
  -H "Authorization: Bearer {ADMIN_TOKEN}"
```

---

## Admin Frontend 통합 테스트

### 시나리오 5: 관리자 로그인 → 대시보드 접근
1. http://localhost:5173/admin/login 접속
2. 시드 데이터의 관리자 계정으로 로그인
3. 대시보드 페이지 리다이렉트 확인
4. SSE 연결 상태 "실시간 연결됨" 확인

### 시나리오 6: SSE 실시간 주문 수신
1. 관리자 대시보드 열기
2. 고객 앱에서 주문 생성 (또는 API 직접 호출)
3. 대시보드에 신규 주문 카드 표시 확인 (2초 이내)

### 시나리오 7: 주문 상태 변경 (UI)
1. 대시보드에서 테이블 카드 클릭
2. 주문 상세 모달에서 상태 드롭다운 변경
3. 상태 배지 업데이트 + 토스트 알림 확인

### 시나리오 8: 테이블 이용 완료 (UI)
1. 테이블 관리 페이지 접속
2. 이용 완료 버튼 클릭 → 확인 팝업 → 확인
3. 테이블 카드 리셋 확인

### 시나리오 9: 메뉴 CRUD (UI)
1. 메뉴 관리 페이지 접속
2. 메뉴 등록 → 목록에 추가 확인
3. 메뉴 수정 → 변경 반영 확인
4. 메뉴 삭제 → 목록에서 제거 확인

---

## 검증 포인트
- 인증 토큰 발급 및 검증 동작
- 역할 기반 접근 제어 (TABLE vs ADMIN)
- 주문 생성 → SSE 이벤트 수신 (2초 이내)
- 주문 상태 전이 규칙 준수
- 이용 완료 → 주문 이력 이동
- 프론트엔드 ↔ 백엔드 API 연동

## Cleanup
```bash
docker-compose down
```
