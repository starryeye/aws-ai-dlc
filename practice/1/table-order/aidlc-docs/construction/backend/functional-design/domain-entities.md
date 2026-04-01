# Unit 1: Backend API - 도메인 엔티티 설계

---

## 1. Store (매장)

| 필드 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | Long | PK, AUTO_INCREMENT | 매장 ID |
| storeCode | String(50) | UNIQUE, NOT NULL | 매장 식별 코드 |
| name | String(100) | NOT NULL | 매장명 |
| createdAt | LocalDateTime | NOT NULL, DEFAULT NOW | 생성 시각 |
| updatedAt | LocalDateTime | NOT NULL, DEFAULT NOW | 수정 시각 |

**관계**: Store 1 --- N StoreUser, Store 1 --- N TableEntity, Store 1 --- N MenuCategory

---

## 2. StoreUser (매장 사용자/관리자)

| 필드 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | Long | PK, AUTO_INCREMENT | 사용자 ID |
| storeId | Long | FK(Store), NOT NULL | 매장 ID |
| username | String(50) | NOT NULL | 사용자명 |
| password | String(255) | NOT NULL | bcrypt 해싱된 비밀번호 |
| role | String(20) | NOT NULL, DEFAULT 'ADMIN' | 역할 (ADMIN) |
| loginAttempts | Integer | NOT NULL, DEFAULT 0 | 연속 로그인 실패 횟수 |
| lockedUntil | LocalDateTime | NULLABLE | 잠금 해제 시각 |
| createdAt | LocalDateTime | NOT NULL, DEFAULT NOW | 생성 시각 |

**제약**: UNIQUE(storeId, username)
**관계**: StoreUser N --- 1 Store

---

## 3. TableEntity (테이블)

| 필드 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | Long | PK, AUTO_INCREMENT | 테이블 ID |
| storeId | Long | FK(Store), NOT NULL | 매장 ID |
| tableNumber | String(20) | NOT NULL | 테이블 번호 |
| password | String(255) | NOT NULL | bcrypt 해싱된 테이블 비밀번호 |
| createdAt | LocalDateTime | NOT NULL, DEFAULT NOW | 생성 시각 |

**제약**: UNIQUE(storeId, tableNumber)
**관계**: TableEntity N --- 1 Store, TableEntity 1 --- N TableSession

---

## 4. TableSession (테이블 세션)

| 필드 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | Long | PK, AUTO_INCREMENT | 세션 ID |
| sessionUuid | String(36) | UNIQUE, NOT NULL | 세션 UUID (외부 식별자) |
| storeId | Long | FK(Store), NOT NULL | 매장 ID |
| tableId | Long | FK(TableEntity), NOT NULL | 테이블 ID |
| active | Boolean | NOT NULL, DEFAULT TRUE | 활성 여부 |
| startedAt | LocalDateTime | NOT NULL, DEFAULT NOW | 세션 시작 시각 |
| completedAt | LocalDateTime | NULLABLE | 이용 완료 시각 |
| expiresAt | LocalDateTime | NOT NULL | 만료 시각 (시작 + 16시간) |

**관계**: TableSession N --- 1 TableEntity, TableSession 1 --- N Order

---

## 5. MenuCategory (메뉴 카테고리)

| 필드 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | Long | PK, AUTO_INCREMENT | 카테고리 ID |
| storeId | Long | FK(Store), NOT NULL | 매장 ID |
| name | String(50) | NOT NULL | 카테고리명 |
| displayOrder | Integer | NOT NULL, DEFAULT 0 | 노출 순서 |
| createdAt | LocalDateTime | NOT NULL, DEFAULT NOW | 생성 시각 |

**제약**: UNIQUE(storeId, name)
**관계**: MenuCategory N --- 1 Store, MenuCategory 1 --- N MenuItem

---

## 6. MenuItem (메뉴 아이템)

| 필드 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | Long | PK, AUTO_INCREMENT | 메뉴 ID |
| storeId | Long | FK(Store), NOT NULL | 매장 ID |
| categoryId | Long | FK(MenuCategory), NOT NULL | 카테고리 ID |
| name | String(100) | NOT NULL | 메뉴명 |
| price | BigDecimal(10,0) | NOT NULL, CHECK(0~999999) | 가격 (원) |
| description | String(500) | NULLABLE | 메뉴 설명 |
| imageUrl | String(500) | NULLABLE | 이미지 외부 URL |
| displayOrder | Integer | NOT NULL, DEFAULT 0 | 노출 순서 |
| deleted | Boolean | NOT NULL, DEFAULT FALSE | 소프트 삭제 플래그 |
| createdAt | LocalDateTime | NOT NULL, DEFAULT NOW | 생성 시각 |
| updatedAt | LocalDateTime | NOT NULL, DEFAULT NOW | 수정 시각 |

**관계**: MenuItem N --- 1 MenuCategory, MenuItem N --- 1 Store

---

## 7. Order (주문)

| 필드 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | Long | PK, AUTO_INCREMENT | 주문 ID |
| orderNumber | String(30) | UNIQUE, NOT NULL | 주문 번호 (ORD-yyyyMMdd-NNN) |
| storeId | Long | FK(Store), NOT NULL | 매장 ID |
| tableId | Long | FK(TableEntity), NOT NULL | 테이블 ID |
| sessionId | Long | FK(TableSession), NOT NULL | 세션 ID |
| totalAmount | BigDecimal(12,0) | NOT NULL | 총 주문 금액 |
| status | String(20) | NOT NULL, DEFAULT 'PENDING' | 상태 (PENDING/PREPARING/COMPLETED) |
| createdAt | LocalDateTime | NOT NULL, DEFAULT NOW | 주문 시각 |
| updatedAt | LocalDateTime | NOT NULL, DEFAULT NOW | 수정 시각 |

**관계**: Order N --- 1 TableSession, Order N --- 1 Store, Order 1 --- N OrderItem

---

## 8. OrderItem (주문 항목)

| 필드 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | Long | PK, AUTO_INCREMENT | 주문 항목 ID |
| orderId | Long | FK(Order), NOT NULL | 주문 ID |
| menuId | Long | FK(MenuItem), NOT NULL | 메뉴 ID (참조용) |
| menuName | String(100) | NOT NULL | 메뉴명 (주문 시점 스냅샷) |
| quantity | Integer | NOT NULL, CHECK(>=1) | 수량 |
| unitPrice | BigDecimal(10,0) | NOT NULL | 단가 (주문 시점 스냅샷) |
| subtotal | BigDecimal(12,0) | NOT NULL | 소계 (quantity × unitPrice) |

**관계**: OrderItem N --- 1 Order

---

## 9. OrderHistory (과거 주문 이력)

| 필드 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | Long | PK, AUTO_INCREMENT | 이력 ID |
| storeId | Long | NOT NULL | 매장 ID |
| tableId | Long | NOT NULL | 테이블 ID |
| tableNumber | String(20) | NOT NULL | 테이블 번호 |
| orderNumber | String(30) | NOT NULL | 주문 번호 |
| sessionUuid | String(36) | NOT NULL | 세션 UUID |
| items | String(TEXT) | NOT NULL | 주문 항목 JSON 직렬화 |
| totalAmount | BigDecimal(12,0) | NOT NULL | 총 금액 |
| status | String(20) | NOT NULL | 최종 상태 |
| orderedAt | LocalDateTime | NOT NULL | 주문 시각 |
| completedAt | LocalDateTime | NOT NULL | 이용 완료 시각 |

**설계 의도**: 세션 종료(이용 완료) 시 Order/OrderItem을 이 테이블로 이동. 원본 Order는 삭제하여 대시보드를 깔끔하게 유지. items는 JSON으로 직렬화하여 단일 테이블로 관리.

---

## 10. 엔티티 관계 다이어그램 (ER Diagram)

```
+----------+       +------------+
|  Store   |1----N | StoreUser  |
|----------|       |------------|
| id (PK)  |       | id (PK)    |
| storeCode|       | storeId(FK)|
| name     |       | username   |
+----------+       | password   |
  |1                +------------+
  |
  +--------+--------+--------+
  |1       |1       |1       |1
  N        N        N        N
+-------+ +------+ +------+ +---------+
|Table  | |Menu  | |Menu  | |Order    |
|Entity | |Categ.| |Item  | |         |
|-------| |------| |------| |---------|
|id(PK) | |id(PK)| |id(PK)| |id(PK)  |
|storeId| |storeId| |storeId| |storeId |
|tableNo| |name  | |name  | |orderNo |
|passwd | |order | |price | |tableId |
+-------+ +------+ |catId | |sessionId|
  |1        |1      |deleted| |status  |
  N         N       +------+ +---------+
+---------+ (1-N)      |1
|Table    |             N
|Session  |         +----------+
|---------+         |OrderItem |
|id(PK)   |         |----------|
|sessionUu|         |id(PK)   |
|tableId  |         |orderId  |
|active   |         |menuId   |
|expiresAt|         |menuName |
+---------+         |quantity |
  |1                |unitPrice|
  N                 +----------+
+---------+
| Order   |
|(위 참조)|
+---------+

+---------------+
| OrderHistory  |
|---------------|
| id(PK)        |
| storeId       |
| tableId       |
| orderNumber   |
| sessionUuid   |
| items (JSON)  |
| totalAmount   |
| completedAt   |
+---------------+
```

### 텍스트 대안 (관계 요약)
- Store → StoreUser (1:N)
- Store → TableEntity (1:N)
- Store → MenuCategory (1:N)
- Store → MenuItem (1:N)
- MenuCategory → MenuItem (1:N)
- TableEntity → TableSession (1:N)
- TableSession → Order (1:N)
- Order → OrderItem (1:N)
- OrderHistory: 독립 테이블 (세션 종료 시 Order 데이터 이동)
