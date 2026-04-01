# 테이블오더 서비스 - 요구사항 확인 질문

아래 질문에 답변해 주세요. 각 질문의 `[Answer]:` 태그 뒤에 선택한 옵션의 알파벳을 입력해 주세요.
선택지 중 맞는 것이 없으면 마지막 옵션(Other)을 선택하고 설명을 추가해 주세요.

---

## Question 1
프론트엔드 기술 스택으로 어떤 것을 사용하시겠습니까?

A) React (Vite + TypeScript)
B) Next.js (TypeScript)
C) Vue.js (TypeScript)
D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 2
백엔드 기술 스택으로 어떤 것을 사용하시겠습니까?

A) Node.js + Express (TypeScript)
B) Node.js + NestJS (TypeScript)
C) Spring Boot (Java/Kotlin)
D) Python + FastAPI
E) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 3
데이터베이스로 어떤 것을 사용하시겠습니까?

A) PostgreSQL
B) MySQL
C) SQLite (개발/프로토타입용)
D) MongoDB
E) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 4
매장(Store)은 단일 매장만 지원하면 되나요, 아니면 다중 매장(멀티테넌트)을 지원해야 하나요?

A) 단일 매장만 지원 (MVP에 적합)
B) 다중 매장 지원 (멀티테넌트 구조)
C) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 5
관리자 계정은 어떻게 관리하시겠습니까?

A) 사전 등록된 단일 관리자 계정 (시드 데이터로 생성)
B) 관리자 회원가입 기능 포함
C) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 6
메뉴 이미지는 어떻게 처리하시겠습니까? (요구사항에 이미지 URL로 명시되어 있습니다)

A) 외부 이미지 URL만 지원 (직접 업로드 없음)
B) 로컬 파일 업로드 지원 (서버에 저장)
C) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 7
테이블 수는 매장당 최대 몇 개 정도를 예상하시나요?

A) 소규모 (1~10개)
B) 중규모 (11~30개)
C) 대규모 (31~100개)
D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 8
배포 환경은 어떻게 계획하고 계신가요?

A) 로컬 개발 환경만 (Docker Compose 등)
B) 클라우드 배포 (AWS, GCP 등)
C) 배포는 나중에 결정, 우선 로컬에서 실행 가능하도록
D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 9
CSS/UI 프레임워크 선호도가 있으신가요?

A) Tailwind CSS
B) Material UI (MUI)
C) Ant Design
D) 순수 CSS / CSS Modules
E) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 10: Security Extensions
이 프로젝트에 보안 확장 규칙을 적용하시겠습니까?

A) Yes — 모든 보안 규칙을 블로킹 제약으로 적용 (프로덕션 수준 애플리케이션에 권장)
B) No — 보안 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
C) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 11: Property-Based Testing Extension
이 프로젝트에 속성 기반 테스팅(PBT) 규칙을 적용하시겠습니까?

A) Yes — 모든 PBT 규칙을 블로킹 제약으로 적용 (비즈니스 로직, 데이터 변환, 직렬화, 상태 관리 컴포넌트가 있는 프로젝트에 권장)
B) Partial — 순수 함수와 직렬화 라운드트립에만 PBT 규칙 적용
C) No — PBT 규칙 건너뛰기 (단순 CRUD, UI 전용 프로젝트에 적합)
D) Other (please describe after [Answer]: tag below)

[Answer]: 
