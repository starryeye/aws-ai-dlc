# Unit 1: Backend API - Code Generation Summary

## 생성된 파일 목록

### 프로젝트 설정
- `backend/build.gradle` - Gradle 빌드 설정
- `backend/settings.gradle` - 프로젝트 설정
- `backend/src/main/resources/application.yml` - 기본 설정
- `backend/src/main/resources/application-docker.yml` - Docker 설정
- `backend/src/main/java/com/tableorder/TableOrderApplication.java` - 메인 클래스

### 엔티티 (9개)
- Store, StoreUser, TableEntity, TableSession
- MenuCategory, MenuItem
- Order, OrderItem, OrderHistory

### 리포지토리 (9개)
- StoreRepository, StoreUserRepository, TableRepository, TableSessionRepository
- MenuCategoryRepository, MenuItemRepository
- OrderRepository, OrderItemRepository, OrderHistoryRepository

### DTO (10개)
- LoginRequest, TokenResponse, UserInfo
- MenuItemRequest, MenuOrderRequest
- OrderRequest, OrderItemRequest, OrderResponse, StatusRequest
- ErrorResponse, OrderEvent

### 서비스 (5개)
- AuthService, MenuService, OrderService, TableSessionService, SseService

### 컨트롤러 (5개)
- AuthController, MenuController, OrderController, TableController, SseController

### 공통 (4개)
- JwtTokenProvider, JwtAuthenticationFilter, SecurityConfig
- GlobalExceptionHandler, RequestLoggingFilter, DataInitializer

### PBT 테스트 (5개)
- AuthServicePBTTest, MenuServicePBTTest, OrderServicePBTTest
- TableSessionServicePBTTest, SseServicePBTTest

### 배포 (3개)
- Dockerfile, docker-compose.yml, .dockerignore

## 스토리 커버리지
- US-01~US-04, US-06~US-15: 14개 스토리 모두 커버
- US-05 (장바구니): 클라이언트 전용 - 백엔드 해당 없음
