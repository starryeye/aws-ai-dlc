# Unit 2: Customer Frontend - 배포 아키텍처

---

## 1. 배포 아키텍처 다이어그램

### Docker Compose 배포 구성

```
┌─────────────────────────────────────────────────┐
│                Docker Compose                    │
│                                                  │
│  ┌──────────────────────┐                        │
│  │  frontend             │                       │
│  │  (nginx:alpine)       │                       │
│  │                       │                       │
│  │  /usr/share/nginx/    │                       │
│  │    html/              │                       │
│  │    ├── index.html     │                       │
│  │    ├── assets/        │                       │
│  │    │   ├── *.js       │                       │
│  │    │   └── *.css      │                       │
│  │    └── favicon.ico    │                       │
│  │                       │                       │
│  │  nginx.conf           │                       │
│  │  └── try_files →      │                       │
│  │      index.html       │                       │
│  │                       │                       │
│  │  :80 → host:3000      │                       │
│  └──────────────────────┘                        │
│                                                  │
│  ┌──────────────────────┐                        │
│  │  backend (Unit 1)     │                       │
│  │  (추후 추가)           │                       │
│  │  :8080 → host:8080    │                       │
│  └──────────────────────┘                        │
│                                                  │
└─────────────────────────────────────────────────┘

브라우저 → http://localhost:3000 → frontend (Nginx)
브라우저 → http://localhost:8080/api/* → backend (직접 호출)
```

### 로컬 개발 구성

```
┌─────────────────────────────────────────────────┐
│              개발자 워크스테이션                    │
│                                                  │
│  ┌──────────────────────┐                        │
│  │  Vite Dev Server      │                       │
│  │  (npm run dev)        │                       │
│  │  :5173                │                       │
│  │  HMR 활성화            │                       │
│  │  .env →               │                       │
│  │    VITE_API_URL=      │                       │
│  │    http://localhost   │                       │
│  │    :8080              │                       │
│  └──────────────────────┘                        │
│           │                                      │
│           │ API 호출                              │
│           ▼                                      │
│  ┌──────────────────────┐                        │
│  │  Docker               │                       │
│  │  backend :8080        │                       │
│  └──────────────────────┘                        │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 2. Dockerfile

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 3. Nginx 설정 파일 (nginx.conf)

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 4. Docker Compose (프론트엔드 서비스)

```yaml
services:
  frontend:
    build:
      context: ./frontend
      args:
        VITE_API_URL: http://localhost:8080
    ports:
      - "3000:80"
    restart: unless-stopped
```

> 참고: backend 서비스는 Unit 1 (Backend API) 구현 시 추가 예정.

---

## 5. 환경변수 파일

### frontend/.env (개발용)

```
VITE_API_URL=http://localhost:8080
```

### frontend/.env.production (Docker 빌드 시 오버라이드 가능)

```
VITE_API_URL=http://localhost:8080
```

---

## 6. 파일 배치

```
table-order/
├── docker-compose.yml          # 전체 서비스 오케스트레이션
├── frontend/
│   ├── Dockerfile              # Multi-stage build
│   ├── nginx.conf              # SPA 라우팅 설정
│   ├── .env                    # 개발용 환경변수
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── api/
│       │   └── axios.ts
│       ├── contexts/
│       ├── pages/
│       ├── components/
│       ├── utils/
│       └── types/
├── backend/                    # Unit 1 (추후)
├── aidlc-docs/
└── requirements/
```
