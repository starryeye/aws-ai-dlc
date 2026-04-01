# 테이블오더 서비스 - Unit of Work 의존성

---

## 의존성 매트릭스

| 유닛 | 의존 대상 | 통신 방식 | 설명 |
|---|---|---|---|
| Unit 2 (Customer) | Unit 1 (Backend) | HTTP/REST | 메뉴 조회, 주문 생성/조회, 인증 |
| Unit 3 (Admin) | Unit 1 (Backend) | HTTP/REST + SSE | 주문 관리, 테이블 관리, 메뉴 관리, 실시간 알림 |
| Unit 2 (Customer) | Unit 3 (Admin) | 없음 (독립) | 직접 의존성 없음 |
| Unit 1 (Backend) | Unit 2, 3 | 없음 | 백엔드는 프론트엔드에 의존하지 않음 |

---

## 의존성 다이어그램

```
+-------------------+
|  Unit 1: Backend  |
|  (Spring Boot)    |
+-------------------+
    ^           ^
    |           |
    | REST      | REST + SSE
    |           |
+--------+  +--------+
| Unit 2 |  | Unit 3 |
| Cust.  |  | Admin  |
+--------+  +--------+
```

---

## 인터페이스 정의

### Unit 2 → Unit 1 (Customer → Backend)
| API | 메서드 | 용도 |
|---|---|---|
| /api/auth/login | POST | 테이블 자동 로그인 |
| /api/auth/validate | GET | 토큰 검증 |
| /api/stores/{id}/categories | GET | 카테고리 조회 |
| /api/stores/{id}/menus | GET | 메뉴 조회 |
| /api/stores/{id}/orders | POST | 주문 생성 |
| /api/stores/{id}/orders | GET | 세션별 주문 조회 |

### Unit 3 → Unit 1 (Admin → Backend)
| API | 메서드 | 용도 |
|---|---|---|
| /api/auth/login | POST | 관리자 로그인 |
| /api/stores/{id}/sse/orders | GET (SSE) | 실시간 주문 구독 |
| /api/stores/{id}/orders/all | GET | 매장 전체 주문 조회 |
| /api/stores/{id}/orders/{id}/status | PATCH | 주문 상태 변경 |
| /api/stores/{id}/orders/{id} | DELETE | 주문 삭제 |
| /api/stores/{id}/tables | GET | 테이블 목록 |
| /api/stores/{id}/tables/{id}/complete | POST | 이용 완료 |
| /api/stores/{id}/tables/{id}/history | GET | 과거 내역 |
| /api/stores/{id}/menus | POST | 메뉴 등록 |
| /api/stores/{id}/menus/{id} | PATCH | 메뉴 수정 |
| /api/stores/{id}/menus/{id} | DELETE | 메뉴 삭제 |
| /api/stores/{id}/menus/order | PATCH | 메뉴 순서 변경 |

### Unit 2 ↔ Unit 3 (공유 코드)
| 공유 영역 | 내용 |
|---|---|
| shared/api/ | Axios 인스턴스, 인터셉터, 에러 핸들링 |
| shared/types/ | DTO 타입 정의 (Request/Response) |
| shared/auth/ | 토큰 저장/조회/삭제 유틸리티 |

---

## 개발 순서 (동시 개발)

```
Week 1-N: 병렬 개발
+-- Unit 1 (Backend): API 구현
+-- Unit 2 (Customer): 고객 UI 구현 (API 명세 기반)
+-- Unit 3 (Admin): 관리자 UI 구현 (API 명세 기반)

통합: Docker Compose로 전체 시스템 통합 테스트
```
