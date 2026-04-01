# Infrastructure Design Plan - Unit 2: Customer Frontend

## 개요
고객용 프론트엔드의 논리적 컴포넌트를 실제 인프라 구성으로 매핑합니다.
배포 환경: 로컬 Docker Compose (Requirements Analysis Q4: A)

---

## 평가 단계

- [x] Step 1: 빌드 및 서빙 인프라 결정
- [x] Step 2: 컨테이너 구성 결정
- [x] Step 3: 네트워킹 및 API 프록시 결정
- [x] Step 4: 개발 환경 구성 결정
- [x] Step 5: 인프라 설계 산출물 생성

---

## 질문 (Infrastructure Questions)

### 1. 빌드 및 서빙

**Q1-1**: 프론트엔드 정적 파일 서빙 방식은?
- (A) Nginx 컨테이너에서 빌드된 정적 파일 서빙 (multi-stage build)
- (B) Node.js 서버로 서빙 (express/serve)
- (C) Vite preview 모드로 서빙
[Answer]: A

**Q1-2**: Nginx 사용 시 SPA 라우팅 처리는?
- (A) try_files로 모든 경로를 index.html로 폴백
- (B) 별도 설정 없음 (hash 라우팅 사용)
[Answer]: A

### 2. 컨테이너 구성

**Q2-1**: 프론트엔드 Docker 이미지 베이스는?
- (A) node:20-alpine (빌드) + nginx:alpine (서빙) - multi-stage
- (B) node:20-alpine 단일 이미지
[Answer]: A

**Q2-2**: 프론트엔드와 백엔드를 같은 docker-compose.yml에서 관리할까요?
- (A) 하나의 docker-compose.yml에서 전체 관리
- (B) 프론트엔드/백엔드 별도 compose 파일
[Answer]: A (프론트엔드 서비스만 정의, 백엔드는 Unit 1에서 추가)

### 3. 네트워킹 및 API 프록시

**Q3-1**: 프론트엔드에서 백엔드 API 호출 방식은?
- (A) Nginx reverse proxy로 /api/* 요청을 백엔드 컨테이너로 프록시
- (B) 프론트엔드에서 직접 백엔드 컨테이너 포트로 호출 (CORS 설정)
- (C) 환경변수로 API URL 주입, 직접 호출
[Answer]: C

**Q3-2**: 외부 접근 포트는?
- (A) 프론트엔드: 80, 백엔드: 8080 (각각 노출)
- (B) 프론트엔드(Nginx): 80만 노출, 백엔드는 내부 네트워크만
- (C) 프론트엔드: 3000, 백엔드: 8080
[Answer]: C

### 4. 개발 환경

**Q4-1**: 로컬 개발 시 프론트엔드 실행 방식은?
- (A) Vite dev server (HMR) + 백엔드는 Docker로 실행
- (B) 전부 Docker Compose로 실행 (개발 시에도)
- (C) 전부 로컬 실행 (Docker 미사용)
[Answer]: A

**Q4-2**: 환경변수 관리 방식은?
- (A) .env 파일 + Vite의 VITE_ 접두사 환경변수
- (B) docker-compose.yml의 environment 섹션만 사용
- (C) 둘 다 사용 (개발: .env, 배포: docker-compose environment)
[Answer]: A
