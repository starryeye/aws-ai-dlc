# 테이블오더 서비스 - Story-Unit 매핑

---

## 스토리-유닛 매핑 테이블

| Story ID | 스토리 | Unit 1 (Backend) | Unit 2 (Customer) | Unit 3 (Admin) |
|---|---|---|---|---|
| US-01 | 테이블 태블릿 초기 설정 | ✅ 인증 API | ✅ SetupPage | - |
| US-02 | 테이블 자동 로그인 | ✅ 인증 API | ✅ 자동 로그인 로직 | - |
| US-03 | 카테고리별 메뉴 조회 | ✅ 메뉴 API | ✅ MenuPage | - |
| US-04 | 메뉴 상세 정보 확인 | ✅ 메뉴 API | ✅ MenuPage | - |
| US-05 | 장바구니 추가/수량 조절 | - | ✅ CartPage (localStorage) | - |
| US-06 | 주문 확정 및 생성 | ✅ 주문 API | ✅ OrderConfirmPage | - |
| US-07 | 현재 세션 주문 내역 조회 | ✅ 주문 API | ✅ OrderHistoryPage | - |
| US-08 | 관리자 로그인 | ✅ 인증 API | - | ✅ LoginPage |
| US-09 | 실시간 주문 대시보드 | ✅ SSE + 주문 API | - | ✅ DashboardPage |
| US-10 | 주문 상태 변경 | ✅ 주문 API | - | ✅ DashboardPage |
| US-11 | 주문 삭제 | ✅ 주문 API | - | ✅ TableManagementPage |
| US-12 | 테이블 이용 완료 | ✅ 테이블 API | - | ✅ TableManagementPage |
| US-13 | 과거 주문 내역 조회 | ✅ 테이블 API | - | ✅ OrderHistoryModal |
| US-14 | 메뉴 조회 (관리자) | ✅ 메뉴 API | - | ✅ MenuManagementPage |
| US-15 | 메뉴 등록/수정/삭제 | ✅ 메뉴 API | - | ✅ MenuManagementPage |

---

## 유닛별 스토리 요약

### Unit 1: Backend API
- **담당 스토리**: 15개 중 14개 (US-01 ~ US-04, US-06 ~ US-15)
- **제외**: US-05 (장바구니는 클라이언트 전용)
- **역할**: 모든 비즈니스 로직, 데이터 영속성, 인증, 실시간 통신

### Unit 2: Customer Frontend
- **담당 스토리**: 7개 (US-01 ~ US-07)
- **역할**: 고객 대면 UI, 장바구니 로컬 관리, 주문 플로우

### Unit 3: Admin Frontend
- **담당 스토리**: 8개 (US-08 ~ US-15)
- **역할**: 관리자 대면 UI, 실시간 대시보드, 테이블/메뉴 관리

---

## 크로스 유닛 스토리

| Story ID | 관련 유닛 | 크로스 포인트 |
|---|---|---|
| US-01 | Unit 1 + Unit 2 | 인증 API ↔ SetupPage |
| US-02 | Unit 1 + Unit 2 | 인증 API ↔ 자동 로그인 |
| US-03, US-04 | Unit 1 + Unit 2 | 메뉴 API ↔ MenuPage |
| US-06 | Unit 1 + Unit 2 | 주문 API ↔ OrderConfirmPage |
| US-07 | Unit 1 + Unit 2 | 주문 API ↔ OrderHistoryPage |
| US-08 | Unit 1 + Unit 3 | 인증 API ↔ LoginPage |
| US-09 | Unit 1 + Unit 3 | SSE + 주문 API ↔ DashboardPage |
| US-10 ~ US-15 | Unit 1 + Unit 3 | 각 API ↔ 관리자 페이지 |

모든 크로스 유닛 스토리는 Unit 1(Backend)을 중심으로 연결됩니다.
US-05(장바구니)만 Unit 2 단독 스토리입니다.
