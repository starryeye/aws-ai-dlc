# 테이블오더 서비스 - 요구사항 명확화 질문

요구사항 문서를 분석했습니다. 아래 질문들에 답변해 주세요.
각 질문의 `[Answer]:` 태그 뒤에 선택한 알파벳을 입력해 주세요.
제공된 옵션이 맞지 않는 경우 마지막 옵션(Other)을 선택하고 설명을 추가해 주세요.

---

## Question 1
기술 스택 선호도가 있으신가요? (백엔드)

A) Node.js (Express / Fastify)
B) Python (FastAPI / Django)
C) Java (Spring Boot)
D) Go
E) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 2
기술 스택 선호도가 있으신가요? (프론트엔드)

A) React (TypeScript)
B) Vue.js
C) Vanilla JavaScript (프레임워크 없음)
D) Next.js (React SSR)
E) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
데이터베이스 선호도가 있으신가요?

A) PostgreSQL (관계형 DB)
B) MySQL (관계형 DB)
C) SQLite (경량 관계형 DB - 개발/소규모용)
D) MongoDB (NoSQL)
E) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 4
배포 환경은 어떻게 되나요?

A) 로컬 개발 환경만 (Docker Compose)
B) AWS (EC2, RDS, S3 등)
C) 기타 클라우드 (GCP, Azure)
D) 온프레미스 서버
E) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
메뉴 이미지는 어떻게 관리할 예정인가요?

A) 외부 이미지 URL만 사용 (이미지 업로드 없음)
B) 서버에 직접 파일 업로드
C) 클라우드 스토리지 (S3 등) 업로드
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6
초기 데이터(매장, 메뉴 등)는 어떻게 설정할 예정인가요?

A) 시드 데이터(seed data)로 초기 데이터 자동 생성
B) 관리자 UI를 통해 직접 입력
C) API를 통해 수동 입력
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7
동시에 운영할 예상 매장 수는 어느 정도인가요?

A) 1개 매장 (단일 매장 MVP)
B) 소규모 (2~10개 매장)
C) 중규모 (10~100개 매장)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 8
테이블당 예상 동시 주문 처리량은 어느 정도인가요?

A) 소규모 (매장당 테이블 10개 이하)
B) 중규모 (매장당 테이블 10~30개)
C) 대규모 (매장당 테이블 30개 이상)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9
관리자 메뉴 관리 기능(CRUD)도 MVP에 포함해야 하나요?
(요구사항 문서의 MVP 범위에는 메뉴 관리가 명시되어 있지 않습니다)

A) 예 - 메뉴 관리(조회/등록/수정/삭제)도 MVP에 포함
B) 아니오 - 메뉴는 시드 데이터로만 관리, 관리 UI 불필요
C) 부분적으로 - 메뉴 조회만 포함 (등록/수정/삭제 제외)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 10
SSE(Server-Sent Events) 실시간 주문 알림의 연결 끊김 처리는 어떻게 할까요?

A) 자동 재연결 (클라이언트 측 재연결 로직 포함)
B) 페이지 새로고침으로 수동 재연결
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 11
테이블 세션 관리에서 16시간 자동 만료 외에 추가 처리가 필요한가요?

A) 아니오 - 16시간 만료 및 관리자 수동 종료만으로 충분
B) 예 - 비활성 테이블 자동 감지 및 알림 필요
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question: Security Extension
보안 확장 규칙을 이 프로젝트에 적용할까요?

A) 예 - 모든 보안 규칙을 필수 제약으로 적용 (프로덕션 수준 애플리케이션에 권장)
B) 아니오 - 보안 규칙 생략 (PoC, 프로토타입, 실험적 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question: Property-Based Testing Extension
속성 기반 테스트(PBT) 규칙을 이 프로젝트에 적용할까요?

A) 예 - 모든 PBT 규칙을 필수 제약으로 적용 (비즈니스 로직, 데이터 변환, 직렬화, 상태 컴포넌트가 있는 프로젝트에 권장)
B) 부분적으로 - 순수 함수와 직렬화 라운드트립에만 PBT 규칙 적용
C) 아니오 - PBT 규칙 생략 (단순 CRUD, UI 전용, 비즈니스 로직이 없는 얇은 통합 레이어에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: A
