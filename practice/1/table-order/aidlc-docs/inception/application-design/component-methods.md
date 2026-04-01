# 테이블오더 서비스 - 컴포넌트 메서드 정의

> 비즈니스 규칙 상세는 Functional Design(CONSTRUCTION) 단계에서 정의합니다.

---

## 1. AuthController

| 메서드 | HTTP | 경로 | 입력 | 출력 | 설명 |
|---|---|---|---|---|---|
| login | POST | /api/auth/login | LoginRequest(storeCode, username, password, role) | TokenResponse(token, expiresIn) | 테이블/관리자 통합 로그인 |
| validateToken | GET | /api/auth/validate | Authorization header | UserInfo(storeId, role, tableId?) | 토큰 유효성 검증 |

## 2. MenuController

| 메서드 | HTTP | 경로 | 입력 | 출력 | 설명 |
|---|---|---|---|---|---|
| getCategories | GET | /api/stores/{storeId}/categories | storeId | List\<Category\> | 카테고리 목록 조회 |
| getMenuItems | GET | /api/stores/{storeId}/menus | storeId, categoryId? | List\<MenuItem\> | 메뉴 목록 조회 |
| getMenuItem | GET | /api/stores/{storeId}/menus/{menuId} | storeId, menuId | MenuItem | 메뉴 상세 조회 |
| createMenuItem | POST | /api/stores/{storeId}/menus | storeId, MenuItemRequest | MenuItem | 메뉴 등록 (ADMIN) |
| updateMenuItem | PATCH | /api/stores/{storeId}/menus/{menuId} | storeId, menuId, MenuItemRequest | MenuItem | 메뉴 수정 (ADMIN) |
| deleteMenuItem | DELETE | /api/stores/{storeId}/menus/{menuId} | storeId, menuId | void | 메뉴 삭제 (ADMIN) |
| updateMenuOrder | PATCH | /api/stores/{storeId}/menus/order | storeId, List\<MenuOrderRequest\> | void | 메뉴 순서 변경 (ADMIN) |

## 3. OrderController

| 메서드 | HTTP | 경로 | 입력 | 출력 | 설명 |
|---|---|---|---|---|---|
| createOrder | POST | /api/stores/{storeId}/orders | storeId, OrderRequest(tableId, items, sessionId) | OrderResponse(orderId, orderNumber) | 주문 생성 |
| getOrdersBySession | GET | /api/stores/{storeId}/orders | storeId, sessionId | List\<Order\> | 세션별 주문 조회 |
| getOrdersByStore | GET | /api/stores/{storeId}/orders/all | storeId | List\<Order\> | 매장 전체 주문 조회 (ADMIN) |
| updateOrderStatus | PATCH | /api/stores/{storeId}/orders/{orderId}/status | storeId, orderId, StatusRequest | Order | 주문 상태 변경 (ADMIN) |
| deleteOrder | DELETE | /api/stores/{storeId}/orders/{orderId} | storeId, orderId | void | 주문 삭제 (ADMIN) |

## 4. TableController

| 메서드 | HTTP | 경로 | 입력 | 출력 | 설명 |
|---|---|---|---|---|---|
| getTables | GET | /api/stores/{storeId}/tables | storeId | List\<TableInfo\> | 테이블 목록 조회 (ADMIN) |
| getTableSummary | GET | /api/stores/{storeId}/tables/{tableId}/summary | storeId, tableId | TableSummary(totalAmount, orders) | 테이블 요약 정보 |
| completeTable | POST | /api/stores/{storeId}/tables/{tableId}/complete | storeId, tableId | void | 테이블 이용 완료 (ADMIN) |
| getTableHistory | GET | /api/stores/{storeId}/tables/{tableId}/history | storeId, tableId, dateFrom?, dateTo? | List\<OrderHistory\> | 과거 주문 내역 (ADMIN) |

## 5. SseController

| 메서드 | HTTP | 경로 | 입력 | 출력 | 설명 |
|---|---|---|---|---|---|
| subscribe | GET | /api/stores/{storeId}/sse/orders | storeId | SseEmitter | SSE 주문 이벤트 구독 (ADMIN) |

## 6. AuthService

| 메서드 | 입력 | 출력 | 설명 |
|---|---|---|---|
| authenticate | storeCode, username, password, role | TokenResponse | 인증 처리 및 JWT 발급 |
| validateToken | token | UserInfo | 토큰 검증 및 사용자 정보 반환 |
| hashPassword | rawPassword | hashedPassword | bcrypt 해싱 |
| checkLoginAttempts | storeCode, username | boolean | 로그인 시도 제한 확인 |

## 7. MenuService

| 메서드 | 입력 | 출력 | 설명 |
|---|---|---|---|
| getCategories | storeId | List\<Category\> | 카테고리 목록 |
| getMenuItems | storeId, categoryId? | List\<MenuItem\> | 메뉴 목록 (카테고리 필터) |
| createMenuItem | storeId, MenuItemRequest | MenuItem | 메뉴 등록 |
| updateMenuItem | storeId, menuId, MenuItemRequest | MenuItem | 메뉴 수정 |
| deleteMenuItem | storeId, menuId | void | 메뉴 삭제 |
| updateMenuOrder | storeId, List\<MenuOrderRequest\> | void | 순서 변경 |

## 8. OrderService

| 메서드 | 입력 | 출력 | 설명 |
|---|---|---|---|
| createOrder | storeId, OrderRequest | OrderResponse | 주문 생성 + SSE 이벤트 발행 |
| getOrdersBySession | storeId, sessionId | List\<Order\> | 세션별 주문 조회 |
| getActiveOrdersByStore | storeId | List\<Order\> | 매장 활성 주문 조회 |
| updateOrderStatus | storeId, orderId, status | Order | 상태 변경 + SSE 이벤트 발행 |
| deleteOrder | storeId, orderId | void | 주문 삭제 + 총액 재계산 + SSE 이벤트 발행 |
| calculateTableTotal | storeId, tableId, sessionId | BigDecimal | 테이블 총 주문액 계산 |

## 9. TableSessionService

| 메서드 | 입력 | 출력 | 설명 |
|---|---|---|---|
| getOrCreateSession | storeId, tableId | TableSession | 세션 조회 또는 생성 |
| completeSession | storeId, tableId | void | 세션 종료 + 주문 이력 이동 |
| getTableHistory | storeId, tableId, dateFrom?, dateTo? | List\<OrderHistory\> | 과거 주문 내역 조회 |
| isSessionActive | sessionId | boolean | 세션 활성 여부 확인 |

## 10. SseService

| 메서드 | 입력 | 출력 | 설명 |
|---|---|---|---|
| subscribe | storeId | SseEmitter | SSE 구독 등록 |
| publishOrderEvent | storeId, OrderEvent | void | 주문 이벤트 발행 |
| removeEmitter | storeId, emitterId | void | 연결 해제 |


---

## 11. DTO (Request/Response) 상세 정의

### Request DTOs

#### LoginRequest
| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| storeCode | String | Y | 매장 식별 코드 |
| username | String | Y | 사용자명 (관리자) 또는 테이블 번호 (테이블) |
| password | String | Y | 비밀번호 |
| role | String | Y | 역할 (TABLE / ADMIN) |

#### MenuItemRequest
| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| name | String | Y | 메뉴명 |
| price | BigDecimal | Y | 가격 (0 이상) |
| description | String | N | 메뉴 설명 |
| categoryId | Long | Y | 카테고리 ID |
| imageUrl | String | N | 메뉴 이미지 외부 URL |
| displayOrder | Integer | N | 노출 순서 (기본값: 0) |

#### MenuOrderRequest
| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| menuId | Long | Y | 메뉴 ID |
| displayOrder | Integer | Y | 변경할 노출 순서 |

#### OrderRequest
| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| tableId | Long | Y | 테이블 ID |
| sessionId | String | Y | 테이블 세션 ID |
| items | List\<OrderItemRequest\> | Y | 주문 항목 목록 (1개 이상) |

#### OrderItemRequest
| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| menuId | Long | Y | 메뉴 ID |
| menuName | String | Y | 메뉴명 (주문 시점 스냅샷) |
| quantity | Integer | Y | 수량 (1 이상) |
| unitPrice | BigDecimal | Y | 단가 (주문 시점 스냅샷) |

#### StatusRequest
| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| status | String | Y | 변경할 상태 (PENDING / PREPARING / COMPLETED) |

---

### Response DTOs

#### TokenResponse
| 필드 | 타입 | 설명 |
|---|---|---|
| token | String | JWT 토큰 |
| expiresIn | Long | 만료 시간 (초) |
| role | String | 역할 (TABLE / ADMIN) |
| storeId | Long | 매장 ID |

#### UserInfo
| 필드 | 타입 | 설명 |
|---|---|---|
| storeId | Long | 매장 ID |
| role | String | 역할 |
| tableId | Long? | 테이블 ID (TABLE 역할만) |
| username | String | 사용자명 |

#### Category
| 필드 | 타입 | 설명 |
|---|---|---|
| id | Long | 카테고리 ID |
| name | String | 카테고리명 |
| displayOrder | Integer | 노출 순서 |

#### MenuItem
| 필드 | 타입 | 설명 |
|---|---|---|
| id | Long | 메뉴 ID |
| name | String | 메뉴명 |
| price | BigDecimal | 가격 |
| description | String? | 메뉴 설명 |
| categoryId | Long | 카테고리 ID |
| categoryName | String | 카테고리명 |
| imageUrl | String? | 이미지 URL |
| displayOrder | Integer | 노출 순서 |

#### OrderResponse
| 필드 | 타입 | 설명 |
|---|---|---|
| orderId | Long | 주문 ID |
| orderNumber | String | 주문 번호 (표시용) |
| totalAmount | BigDecimal | 총 주문 금액 |
| status | String | 주문 상태 |
| createdAt | LocalDateTime | 주문 시각 |

#### Order
| 필드 | 타입 | 설명 |
|---|---|---|
| id | Long | 주문 ID |
| orderNumber | String | 주문 번호 |
| tableId | Long | 테이블 ID |
| tableNumber | String | 테이블 번호 |
| sessionId | String | 세션 ID |
| items | List\<OrderItem\> | 주문 항목 목록 |
| totalAmount | BigDecimal | 총 금액 |
| status | String | 상태 (PENDING/PREPARING/COMPLETED) |
| createdAt | LocalDateTime | 주문 시각 |

#### OrderItem
| 필드 | 타입 | 설명 |
|---|---|---|
| id | Long | 주문 항목 ID |
| menuId | Long | 메뉴 ID |
| menuName | String | 메뉴명 |
| quantity | Integer | 수량 |
| unitPrice | BigDecimal | 단가 |
| subtotal | BigDecimal | 소계 (수량 × 단가) |

#### TableInfo
| 필드 | 타입 | 설명 |
|---|---|---|
| id | Long | 테이블 ID |
| tableNumber | String | 테이블 번호 |
| sessionId | String? | 현재 세션 ID |
| sessionActive | Boolean | 세션 활성 여부 |
| totalAmount | BigDecimal | 현재 총 주문액 |
| orderCount | Integer | 현재 주문 수 |

#### TableSummary
| 필드 | 타입 | 설명 |
|---|---|---|
| tableId | Long | 테이블 ID |
| tableNumber | String | 테이블 번호 |
| totalAmount | BigDecimal | 총 주문액 |
| orders | List\<Order\> | 현재 주문 목록 |

#### OrderHistory
| 필드 | 타입 | 설명 |
|---|---|---|
| id | Long | 이력 ID |
| orderNumber | String | 주문 번호 |
| tableNumber | String | 테이블 번호 |
| items | List\<OrderItem\> | 주문 항목 |
| totalAmount | BigDecimal | 총 금액 |
| orderedAt | LocalDateTime | 주문 시각 |
| completedAt | LocalDateTime | 이용 완료 시각 |

#### OrderEvent (SSE)
| 필드 | 타입 | 설명 |
|---|---|---|
| eventType | String | 이벤트 유형 (NEW_ORDER / STATUS_CHANGED / ORDER_DELETED / TABLE_COMPLETED) |
| orderId | Long? | 주문 ID |
| tableId | Long | 테이블 ID |
| tableNumber | String | 테이블 번호 |
| data | Object | 이벤트 상세 데이터 (Order 또는 요약 정보) |
