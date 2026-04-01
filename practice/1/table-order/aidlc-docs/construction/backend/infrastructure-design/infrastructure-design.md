# Unit 1: Backend API - 인프라 설계

---

## 1. 배포 환경 개요

| 항목 | 값 |
|---|---|
| 배포 방식 | Docker Compose (로컬) |
| 컨테이너 수 | 1개 (Backend API) |
| 데이터베이스 | SQLite (컨테이너 내부 파일) |
| 네트워크 | Docker 브릿지 네트워크 |
| 외부 포트 | 8080 |

---

## 2. Dockerfile (멀티스테이지 빌드)

```dockerfile
# Stage 1: Build
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY gradle/ gradle/
COPY gradlew build.gradle settings.gradle ./
RUN chmod +x gradlew
RUN ./gradlew dependencies --no-daemon
COPY src/ src/
RUN ./gradlew bootJar --no-daemon -x test

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN mkdir -p /app/data
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 빌드 최적화
- 의존성 레이어 캐싱 (gradlew dependencies 먼저 실행)
- 테스트 스킵 (-x test) — 빌드 시간 단축
- Alpine 기반 경량 이미지 (~100MB)

---

## 3. Docker Compose 서비스 구성

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: tableorder-backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - JWT_SECRET=your-256-bit-secret-key-for-development
    networks:
      - tableorder-network
    restart: unless-stopped

networks:
  tableorder-network:
    driver: bridge
```

### 프론트엔드 통합 시 (다른 담당자가 추가)
```yaml
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: tableorder-frontend
    ports:
      - "3000:80"
    networks:
      - tableorder-network
    depends_on:
      - backend
```

---

## 4. SQLite 데이터 관리

| 항목 | 설정 |
|---|---|
| 파일 경로 | /app/data/tableorder.db |
| 영속성 | 컨테이너 내부 (삭제 시 초기화) |
| 초기화 | DataInitializer로 시드 데이터 자동 생성 |
| WAL 모드 | 활성화 (동시 읽기 성능) |

컨테이너 삭제 시 데이터가 초기화되므로, 시드 데이터가 매번 자동 생성됨. 개발 환경에서 깨끗한 상태로 시작 가능.

---

## 5. 네트워크 구성

```
+------------------------------------------+
| Docker Network: tableorder-network       |
|                                          |
|  +------------------+                    |
|  | backend          |                    |
|  | :8080            |-----> Host :8080   |
|  | (Spring Boot)    |                    |
|  +------------------+                    |
|                                          |
|  +------------------+                    |
|  | frontend         |                    |
|  | :80              |-----> Host :3000   |
|  | (Nginx + React)  |                    |
|  +------------------+                    |
+------------------------------------------+
```

- 컨테이너 간 통신: Docker 내부 네트워크 (서비스명으로 접근)
- 프론트엔드 → 백엔드: `http://backend:8080` (Docker 내부)
- 외부 접근: `http://localhost:8080` (API), `http://localhost:3000` (UI)

---

## 6. 환경별 설정

### application.yml (기본 - 로컬 개발)
```yaml
spring:
  datasource:
    url: jdbc:sqlite:./data/tableorder.db
server:
  port: 8080
```

### application-docker.yml (Docker 환경)
```yaml
spring:
  datasource:
    url: jdbc:sqlite:/app/data/tableorder.db
jwt:
  secret: ${JWT_SECRET}
```
