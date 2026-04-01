# 테이블오더 서비스 - 서비스 레이어 설계

---

## 서비스 정의

### AuthService
- **책임**: 인증/인가 처리
- **역할 구분**: TABLE (고객 태블릿), ADMIN (매장 관리자)
- **JWT 발급**: 역할, 매장ID, 테이블ID(TABLE만) 포함
- **세션 관리**: 16시간 만료
- **보안**: bcrypt 해싱, 로그인 시도 제한

### MenuService
- **책임**: 메뉴 및 카테고리 관리
- **읽기**: 고객/관리자 모두 접근 가능
- **쓰기**: ADMIN 역할만 접근 가능 (등록/수정/삭제/순서 변경)
- **검증**: 필수 필드, 가격 범위

### OrderService
- **책임**: 주문 생명주기 관리
- **주문 생성**: 세션 확인 → 주문 저장 → SSE 이벤트 발행
- **상태 변경**: 대기중 → 준비중 → 완료 (ADMIN만)
- **주문 삭제**: ADMIN만, 총액 재계산 후 SSE 이벤트 발행
- **의존**: SseService (이벤트 발행), TableSessionService (세션 확인)

### TableSessionService
- **책임**: 테이블 세션 생명주기 관리
- **세션 시작**: 첫 주문 시 자동 생성
- **세션 종료**: 관리자 이용 완료 처리 → 주문 이력 이동 → 리셋
- **과거 내역**: 종료된 세션의 주문 이력 조회

### SseService
- **책임**: 실시간 이벤트 스트리밍
- **구독 관리**: 매장별 SseEmitter 관리
- **이벤트 유형**: 신규 주문, 상태 변경, 주문 삭제
- **연결 관리**: 타임아웃 처리, 자동 정리

---

## 서비스 오케스트레이션 패턴

### 주문 생성 플로우
```
OrderController.createOrder()
  -> OrderService.createOrder()
    -> TableSessionService.getOrCreateSession()  // 세션 확인/생성
    -> OrderRepository.save()                     // 주문 저장
    -> SseService.publishOrderEvent()             // 실시간 알림
  -> return OrderResponse
```

### 테이블 이용 완료 플로우
```
TableController.completeTable()
  -> TableSessionService.completeSession()
    -> OrderRepository.findBySession()            // 현재 주문 조회
    -> OrderHistoryRepository.saveAll()            // 이력 이동
    -> OrderRepository.deleteBySession()           // 현재 주문 삭제
    -> TableSession.close()                        // 세션 종료
    -> SseService.publishOrderEvent()              // 대시보드 갱신
  -> return success
```

### 주문 상태 변경 플로우
```
OrderController.updateOrderStatus()
  -> OrderService.updateOrderStatus()
    -> OrderRepository.findById()                  // 주문 조회
    -> Order.updateStatus()                        // 상태 변경
    -> OrderRepository.save()                      // 저장
    -> SseService.publishOrderEvent()              // 실시간 알림
  -> return Order
```
