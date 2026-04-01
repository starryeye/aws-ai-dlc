# Unit 3: Admin Frontend - 배포 아키텍처

---

## 전체 시스템 배포 구조

```
+---------------------------------------------------+
|              Docker Compose Network                |
|                                                    |
|  +------------------+    +---------------------+   |
|  |   frontend       |    |   backend           |   |
|  |   (Nginx)        |    |   (Spring Boot)     |   |
|  |   Port: 3000:80  |    |   Port: 8080:8080   |   |
|  |                  |    |                     |   |
|  |  Static Files    |    |  REST API           |   |
|  |  /admin/*        |--->|  /api/*             |   |
|  |  /table/*        |    |  SSE /api/sse/*     |   |
|  |  API Proxy       |    |  SQLite DB          |   |
|  +------------------+    +---------------------+   |
|                                  |                  |
|                          +-------v-------+          |
|                          | sqlite-data   |          |
|                          | (volume)      |          |
|                          +---------------+          |
+---------------------------------------------------+
```

---

## 네트워크 흐름

### 브라우저 → Frontend (Nginx)
```
브라우저 --> http://localhost:3000/admin/dashboard
         --> Nginx가 /usr/share/nginx/html/index.html 반환
         --> React SPA 로드
```

### Frontend (Nginx) → Backend (API Proxy)
```
React App --> /api/stores/1/orders
          --> Nginx proxy_pass --> http://backend:8080/api/stores/1/orders
          --> Backend 응답 --> Nginx --> React App
```

### SSE 스트리밍
```
React App --> /api/stores/1/sse/orders
          --> Nginx (proxy_buffering off)
          --> http://backend:8080/api/stores/1/sse/orders
          --> 지속적 SSE 스트림
```

---

## 실행 명령어

### 개발 환경
```bash
# 프론트엔드 개발 서버
cd frontend
npm install
npm run dev    # Vite dev server (http://localhost:5173)
```

### Docker Compose 실행
```bash
# 전체 시스템 실행
docker-compose up --build

# 프론트엔드: http://localhost:3000
# 백엔드 API: http://localhost:8080
```
