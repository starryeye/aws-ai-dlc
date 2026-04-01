# Unit 3: Admin Frontend - Infrastructure Design

---

## 배포 환경
- **환경**: Docker Compose (로컬 개발)
- **컨테이너**: Nginx + 정적 파일 서빙
- **프록시**: Nginx reverse proxy → Backend API

---

## 컨테이너 구성

### Frontend 컨테이너
```
+------------------------------------------+
|  frontend (Nginx)                        |
|  Port: 80                                |
|                                          |
|  /admin/*  --> 정적 파일 (React SPA)     |
|  /table/*  --> 정적 파일 (React SPA)     |
|  /api/*    --> reverse proxy --> backend  |
+------------------------------------------+
```

| 항목 | 값 |
|---|---|
| 베이스 이미지 | node:20-alpine (빌드) + nginx:alpine (서빙) |
| 빌드 방식 | Multi-stage Docker build |
| 포트 | 80 (HTTP) |
| 정적 파일 경로 | /usr/share/nginx/html |
| API 프록시 | /api/* → http://backend:8080 |

---

## Dockerfile (Multi-stage)

```
Stage 1: Build
- node:20-alpine
- npm ci
- npm run build
- 출력: dist/

Stage 2: Serve
- nginx:alpine
- dist/ → /usr/share/nginx/html
- nginx.conf (SPA 라우팅 + API 프록시)
```

---

## Nginx 설정 요점

```
- SPA 라우팅: try_files $uri $uri/ /index.html
- API 프록시: location /api/ → proxy_pass http://backend:8080
- SSE 프록시: proxy_buffering off (SSE 스트리밍 지원)
- 정적 파일 캐싱: js/css 1년, html no-cache
- gzip 압축 활성화
```

---

## Docker Compose 통합

```yaml
# frontend 서비스 (Unit 2 + Unit 3 공유)
frontend:
  build: ./frontend
  ports:
    - "3000:80"
  depends_on:
    - backend
  environment:
    - VITE_API_BASE_URL=/api

# backend 서비스 (Unit 1)
backend:
  build: ./backend
  ports:
    - "8080:8080"
  volumes:
    - sqlite-data:/app/data
```

---

## 개발 환경 vs 프로덕션

| 항목 | 개발 (Vite dev) | 프로덕션 (Docker) |
|---|---|---|
| 서버 | Vite dev server | Nginx |
| API 프록시 | vite.config.ts proxy | nginx.conf proxy_pass |
| HMR | 활성화 | N/A |
| 소스맵 | 활성화 | 비활성화 |
| 번들 최적화 | 없음 | minify + tree-shaking |
