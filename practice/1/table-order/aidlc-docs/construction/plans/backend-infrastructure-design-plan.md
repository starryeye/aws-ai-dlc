# Unit 1: Backend API - Infrastructure Design 계획

## 계획 개요
Backend API의 Docker 기반 배포 아키텍처를 설계합니다.
로컬 Docker Compose 환경으로 결정되어 있으므로, 컨테이너 구성과 네트워크 설정에 집중합니다.

---

## 질문

아래 질문에 답변해 주세요.

---

## Question 1
백엔드 컨테이너의 Java 베이스 이미지는 어떤 것을 사용할까요?

A) eclipse-temurin:17-jre-alpine (경량, ~100MB)
B) eclipse-temurin:17-jre (표준, ~200MB)
C) amazoncorretto:17 (Amazon Corretto)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
SQLite 데이터 파일의 영속성은 어떻게 관리할까요?

A) Docker Volume 마운트 (컨테이너 재시작 시 데이터 유지)
B) 컨테이너 내부 저장 (컨테이너 삭제 시 데이터 초기화)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 3
백엔드 포트 매핑은 어떻게 할까요?

A) 8080:8080 (호스트:컨테이너 동일)
B) 다른 포트 사용 (예: 3000:8080)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## 생성 실행 계획

### Step 1: 인프라 설계
- [x] Docker 컨테이너 구성 설계
- [x] Dockerfile 설계 (멀티스테이지 빌드)
- [x] Docker Compose 서비스 구성 설계
- [x] 네트워크 및 볼륨 설계
- [x] `aidlc-docs/construction/backend/infrastructure-design/infrastructure-design.md` 생성

### Step 2: 배포 아키텍처
- [x] 배포 다이어그램 작성
- [x] 환경 변수 및 설정 관리
- [x] `aidlc-docs/construction/backend/infrastructure-design/deployment-architecture.md` 생성

### Step 3: 검증
- [x] Functional Design/NFR Requirements와 일관성 확인
- [x] 프론트엔드 유닛과의 통합 포인트 확인
