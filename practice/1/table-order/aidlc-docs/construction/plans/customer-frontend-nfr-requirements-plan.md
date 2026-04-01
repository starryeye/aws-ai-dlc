# NFR Requirements Plan - Unit 2: Customer Frontend (/table/*)

## 개요
고객용 프론트엔드의 비기능 요구사항 및 기술 스택 세부 결정을 수행합니다.

---

## 평가 단계

- [x] Step 1: 성능 요구사항 정의
- [x] Step 2: 사용성/접근성 요구사항 정의
- [x] Step 3: 신뢰성 요구사항 정의
- [x] Step 4: 기술 스택 세부 결정
- [x] Step 5: 테스트 전략 결정

---

## 질문 (NFR Questions)

### 1. 성능

**Q1-1**: 초기 페이지 로드 목표 시간은?
- (A) 3초 이내 (일반적)
- (B) 1.5초 이내 (빠른 응답)
- (C) 성능 최적화 불필요 (MVP 우선)
[Answer]: C

**Q1-2**: 이미지 최적화 전략은? (메뉴 이미지 외부 URL)
- (A) lazy loading만 적용
- (B) lazy loading + placeholder(빈 이미지 아이콘)
- (C) 최적화 없음 (그대로 로드)
[Answer]: A

### 2. 사용성

**Q2-1**: 반응형 디자인 지원 범위는?
- (A) 태블릿 전용 (768px~1024px)
- (B) 태블릿 + 모바일 (320px~1024px)
- (C) 태블릿만 고려하되 모바일에서도 깨지지 않는 수준
[Answer]: B

**Q2-2**: 다크모드 지원은?
- (A) 라이트모드만
- (B) 다크모드 지원
- (C) 시스템 설정 따라가기
[Answer]: A

### 3. 신뢰성

**Q3-1**: localStorage 데이터 손상 시 처리는?
- (A) 자동 초기화 후 SetupPage 이동
- (B) 에러 표시 후 수동 초기화 버튼 제공
[Answer]: A

**Q3-2**: API 요청 실패 시 재시도 정책은?
- (A) 재시도 없음 (사용자가 직접 재시도)
- (B) 자동 1회 재시도 후 실패 표시
- (C) 3회까지 자동 재시도 (exponential backoff)
[Answer]: A

### 4. 기술 스택 세부

**Q4-1**: CSS 스타일링 방식은?
- (A) CSS Modules
- (B) Tailwind CSS
- (C) styled-components
- (D) 일반 CSS/SCSS
[Answer]: B

**Q4-2**: 폼 관리 라이브러리는?
- (A) 라이브러리 없이 직접 구현 (useState)
- (B) React Hook Form
[Answer]: A

**Q4-3**: 금액 포맷팅은?
- (A) Intl.NumberFormat (브라우저 내장)
- (B) 직접 유틸 함수 구현
[Answer]: A

### 5. 테스트

**Q5-1**: 프론트엔드 테스트 범위는?
- (A) 단위 테스트만 (유틸, 비즈니스 로직)
- (B) 단위 + 컴포넌트 테스트 (React Testing Library)
- (C) 테스트 없음 (MVP 우선)
[Answer]: B

**Q5-2**: 테스트 프레임워크는?
- (A) Vitest + React Testing Library
- (B) Jest + React Testing Library
[Answer]: B
