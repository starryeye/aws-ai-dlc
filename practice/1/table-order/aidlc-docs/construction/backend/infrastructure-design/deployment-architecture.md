# Unit 1: Backend API - 배포 아키텍처

---

## 1. 배포 다이어그램

```
Developer Machine (localhost)
+-------------------------------------------------------+
|                                                       |
|  docker-compose up                                    |
|                                                       |
|  +------------------+    +------------------+         |
|  | tableorder-      |    | tableorder-      |         |
|  | backend          |    | frontend         |         |
|  |                  |    |                  |         |
|  | Spring Boot 3.x  |    | Nginx + React   |         |
|  | Java 17 Alpine   |    | (다른 담당자)    |         |
|  | SQLite (내부)    |    |                  |         |
|  | Port: 8080       |    | Port: 3000       |         |
|  +------------------+    +------------------+         |
|         |                        |                    |
|         +--- tableorder-network -+                    |
|                                                       |
+-------------------------------------------------------+
         |                        |
    localhost:8080           localhost:3000
    (REST API + SSE)         (Web UI)
```

---

## 2. 빌드 및 실행 명령어

### 전체 시스템 시작
```bash
docker-compose up --build
```

### 백엔드만 시작
```bash
docker-compose up --build backend
```

### 백엔드만 재빌드
```bash
docker-compose up --build --force-recreate backend
```

### 중지
```bash
docker-compose down
```

### 로그 확인
```bash
docker-compose logs -f backend
```

---

## 3. 환경 변수

| 변수 | 기본값 | 설명 |
|---|---|---|
| SPRING_PROFILES_ACTIVE | docker | 활성 프로파일 |
| JWT_SECRET | your-256-bit-secret-key-for-development | JWT 서명 키 |
| SERVER_PORT | 8080 | 서버 포트 |

---

## 4. 헬스 체크

### Spring Boot Actuator (선택)
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health
  endpoint:
    health:
      show-details: always
```

### Docker Compose 헬스 체크
```yaml
backend:
  healthcheck:
    test: ["CMD", "wget", "--spider", "-q", "http://localhost:8080/api/auth/validate"]
    interval: 30s
    timeout: 10s
    retries: 3
```

---

## 5. 개발 워크플로우

### 로컬 개발 (Docker 없이)
```bash
cd backend
./gradlew bootRun
# http://localhost:8080 에서 API 접근
# http://localhost:8080/swagger-ui.html 에서 API 문서
```

### Docker 개발
```bash
docker-compose up --build backend
# http://localhost:8080 에서 API 접근
```

### 테스트 실행
```bash
cd backend
./gradlew test
```
