# Performance Test Instructions - Backend API

## 성능 요구사항
| 항목 | 목표 |
|---|---|
| 일반 REST API 응답 | 200ms 이내 |
| SSE 이벤트 전달 | 2초 이내 |
| 동시 접속 | ~100명 |
| 동시 SSE 연결 | ~10개 |

## 간단한 성능 확인 (curl 기반)

### API 응답 시간 측정
```bash
# 메뉴 조회 응답 시간
curl -w "\n응답시간: %{time_total}s\n" http://localhost:8080/api/stores/1/menus

# 주문 생성 응답 시간
curl -w "\n응답시간: %{time_total}s\n" -X POST http://localhost:8080/api/stores/1/orders \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"tableId":1,"sessionId":"{UUID}","items":[{"menuId":1,"menuName":"김치찌개","quantity":1,"unitPrice":8000}]}'
```

## 부하 테스트 (선택 - Apache Bench)

```bash
# 메뉴 조회 100회 동시 10개
ab -n 100 -c 10 http://localhost:8080/api/stores/1/menus

# 카테고리 조회 100회 동시 10개
ab -n 100 -c 10 http://localhost:8080/api/stores/1/categories
```

## 기대 결과
- 소규모 환경(매장 2~10개, 테이블 10개 이하)에서 모든 API 200ms 이내 응답
- SSE 이벤트 2초 이내 전달
