# Build Instructions - 통합 (All Units)

## 사전 요구사항
- Java 17+ (JDK)
- Gradle 8.x (또는 gradlew 래퍼 사용)
- Node.js 20.x LTS + npm 10.x
- Docker & Docker Compose

---

## Unit 1: Backend API

### 1. 의존성 설치
```bash
cd backend
./gradlew dependencies
```

### 2. 컴파일 및 빌드
```bash
./gradlew clean build
```

### 3. 테스트 제외 빌드 (빠른 빌드)
```bash
./gradlew bootJar -x test
```

### 4. 빌드 결과 확인
- JAR 파일: `backend/build/libs/table-order-backend-0.0.1-SNAPSHOT.jar`
- 빌드 성공 시: `BUILD SUCCESSFUL` 메시지 출력

### 로컬 실행 (Docker 없이)
```bash
cd backend
mkdir -p data
./gradlew bootRun
```
- API: http://localhost:8080

---

## Unit 2 + Unit 3: Frontend

### 1. 의존성 설치
```bash
cd frontend
npm install
```

### 2. 빌드
```bash
# 개발 서버 실행
npm run dev
# → http://localhost:5173/table/setup (고객)
# → http://localhost:5173/admin/login (관리자)

# 프로덕션 빌드
npm run build
# → dist/ 디렉토리에 빌드 결과물 생성
```

### 3. 빌드 결과 확인
- **Expected Output**: `dist/` 디렉토리에 `index.html`, `assets/` 폴더 생성
- **번들 사이즈**: gzip 기준 500KB 이하 목표

---

## Docker Compose (전체 시스템)

### 전체 시스템 빌드 및 실행
```bash
docker-compose up --build
```
- Backend API: http://localhost:8080
- Frontend: http://localhost:3000

### 개별 서비스 빌드
```bash
docker-compose build backend
docker-compose build frontend
```

## 트러블슈팅

### SQLite 파일 권한 오류
```bash
mkdir -p backend/data
chmod 755 backend/data
```

### 포트 충돌
```bash
lsof -i :8080  # Backend
lsof -i :5173  # Frontend dev
lsof -i :3000  # Frontend docker
```

### npm install 실패
- Node.js 20.x LTS 사용 확인: `node -v`

### TypeScript 컴파일 에러
- 에러 메시지의 파일/라인 확인 후 타입 수정
