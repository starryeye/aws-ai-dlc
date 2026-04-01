# Unit 2: Customer Frontend - 인프라 설계

---

## 1. 인프라 개요

| 항목 | 결정 |
|---|---|
| 배포 환경 | 로컬 Docker Compose |
| 서빙 방식 | Nginx (정적 파일 서빙) |
| 빌드 방식 | Vite build → dist/ → Nginx |
| Docker 이미지 | Multi-stage (node:20-alpine → nginx:alpine) |
| API 통신 | 환경변수 기반 직접 호출 (VITE_API_URL) |
| 개발 환경 | Vite dev server (HMR) + 백엔드 Docker |

---

## 2. 컨테이너 구성

### 2.1 프론트엔드 컨테이너

| 항목 | 값 |
|---|---|
| 서비스명 | frontend |
| 빌드 스테이지 1 | node:20-alpine (빌드) |
| 빌드 스테이지 2 | nginx:alpine (서빙) |
| 노출 포트 | 3000 (호스트) → 80 (컨테이너 내부 Nginx) |
| 헬스체크 | curl http://localhost:80/ |

### 2.2 Multi-Stage Build 흐름

```
Stage 1: Build
  node:20-alpine
  ├── npm ci (의존성 설치)
  ├── VITE_API_URL 빌드 인자 주입
  └── npm run build → /app/dist/

Stage 2: Serve
  nginx:alpine
  ├── /app/dist/ → /usr/share/nginx/html/
  ├── nginx.conf (SPA 라우팅 설정)
  └── 포트 80 노출
```

---

## 3. 네트워킹

### 3.1 포트 매핑

| 서비스 | 컨테이너 포트 | 호스트 포트 | 용도 |
|---|---|---|---|
| frontend | 80 | 3000 | 프론트엔드 웹 서빙 |
| backend (Unit 1) | 8080 | 8080 | REST API (추후 추가) |

### 3.2 API 통신 방식

프론트엔드는 환경변수 `VITE_API_URL`을 통해 백엔드 API URL을 주입받음.

| 환경 | VITE_API_URL 값 | 설명 |
|---|---|---|
| 로컬 개발 (Vite dev) | http://localhost:8080 | Vite dev server에서 직접 호출 |
| Docker 배포 | http://localhost:8080 | 호스트 네트워크를 통해 백엔드 접근 |

> 참고: Docker 배포 시 VITE_API_URL은 빌드 타임에 주입됨 (Vite는 빌드 시 환경변수를 번들에 포함).
> 따라서 docker-compose.yml의 build args로 전달.

---

## 4. Nginx 설정

### 4.1 SPA 라우팅

React Router의 브라우저 히스토리 모드를 지원하기 위해 `try_files` 설정 필요.

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 정적 파일 캐싱 (JS, CSS, 이미지)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 4.2 설정 포인트

| 항목 | 설정 |
|---|---|
| SPA 폴백 | try_files $uri $uri/ /index.html |
| 정적 파일 캐싱 | 1년 (Vite가 해시 파일명 생성) |
| gzip | Nginx 기본 설정 사용 |

---

## 5. 환경변수

### 5.1 Vite 환경변수 (.env)

| 변수명 | 기본값 | 설명 |
|---|---|---|
| VITE_API_URL | http://localhost:8080 | 백엔드 API 기본 URL |

### 5.2 환경별 파일

| 파일 | 용도 |
|---|---|
| .env | 기본 환경변수 (개발용) |
| .env.production | 프로덕션 빌드 시 오버라이드 (필요 시) |

### 5.3 Axios 연동

```typescript
// api/axios.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});
```

---

## 6. 개발 환경 구성

### 6.1 로컬 개발 워크플로우

```
개발자 워크스테이션
├── Vite dev server (npm run dev)
│   ├── 포트: 5173 (Vite 기본)
│   ├── HMR 활성화
│   └── VITE_API_URL=http://localhost:8080
└── Docker (백엔드만)
    └── backend: 8080
```

### 6.2 Docker 배포 워크플로우

```
Docker Compose
├── frontend (Nginx)
│   ├── 호스트 포트: 3000
│   └── 빌드 시 VITE_API_URL 주입
└── backend (Unit 1에서 추가)
    └── 호스트 포트: 8080
```
