# Unit 2: Customer Frontend - 기술 스택 결정

---

## 1. 핵심 프레임워크

| 기술 | 선택 | 근거 |
|---|---|---|
| UI 프레임워크 | React 18 | 요구사항 명세 (SPA) |
| 언어 | TypeScript (strict) | 타입 안전성, 도메인 엔티티 활용 |
| 빌드 도구 | Vite | 빠른 개발 서버, React 기본 지원 |
| 라우팅 | React Router v6 | /table/* 라우팅 구조 |

---

## 2. 스타일링

| 기술 | 선택 | 근거 |
|---|---|---|
| CSS 프레임워크 | Tailwind CSS | 반응형 유틸리티 클래스, 320px~1024px 대응 용이 |
| 설정 | tailwind.config.js | 커스텀 브레이크포인트 필요 시 설정 |

---

## 3. 상태 관리

| 영역 | 방식 | 근거 |
|---|---|---|
| 인증 상태 | React Context (AuthContext) | 전역 인증 정보 공유 |
| 장바구니 | React Context (CartContext) + localStorage | 영속성 + 전역 접근 |
| 페이지 로컬 상태 | useState / useReducer | 페이지별 로딩, 에러 등 |
| 폼 관리 | useState 직접 구현 | SetupPage 폼 3개 필드, 라이브러리 불필요 |

---

## 4. API 통신

| 기술 | 선택 | 근거 |
|---|---|---|
| HTTP 클라이언트 | Axios | 인터셉터 지원 (토큰 자동 첨부, 401 처리) |
| 재시도 정책 | 없음 | MVP 단순화, 사용자 직접 재시도 |

---

## 5. 금액 포맷팅

| 기술 | 선택 | 근거 |
|---|---|---|
| 포맷터 | Intl.NumberFormat | 브라우저 내장, 외부 의존성 없음 |
| 형식 | `new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })` | ₩12,000 형태 |

---

## 6. 테스트

| 기술 | 선택 | 근거 |
|---|---|---|
| 테스트 프레임워크 | Jest | 안정적, 널리 사용 |
| 컴포넌트 테스트 | React Testing Library | DOM 기반 테스트, 사용자 관점 |
| 테스트 범위 | 단위 + 컴포넌트 테스트 | 유틸/비즈니스 로직 + React 컴포넌트 |
| Property-Based Testing | fast-check (활성화됨) | Extension 설정에 따라 적용 |

### 테스트 대상

| 대상 | 테스트 유형 | 예시 |
|---|---|---|
| 금액 계산 유틸 | 단위 테스트 | subtotal, totalAmount 계산 |
| localStorage 헬퍼 | 단위 테스트 | 저장/로드/손상 처리 |
| CartContext 로직 | 단위 테스트 | addItem, updateQuantity, removeItem |
| SetupPage | 컴포넌트 테스트 | 입력 검증, 로그인 플로우 |
| MenuPage | 컴포넌트 테스트 | 카테고리 필터, 담기 동작 |
| CartPage | 컴포넌트 테스트 | 수량 변경, 삭제, 주문하기 |
| OrderConfirmPage | 컴포넌트 테스트 | 주문 확정, 이중 클릭 방지 |

---

## 7. 프로젝트 구조

```
src/
├── api/
│   └── axios.ts              # Axios 인스턴스 + 인터셉터
├── contexts/
│   ├── AuthContext.tsx        # 인증 컨텍스트
│   └── CartContext.tsx        # 장바구니 컨텍스트
├── pages/
│   ├── SetupPage.tsx
│   ├── MenuPage.tsx
│   ├── CartPage.tsx
│   ├── OrderConfirmPage.tsx
│   ├── OrderSuccessPage.tsx
│   └── OrderHistoryPage.tsx
├── components/
│   ├── Header.tsx
│   ├── CategoryNav.tsx
│   ├── MenuCard.tsx
│   ├── CartBadge.tsx
│   ├── CartItemRow.tsx
│   ├── OrderItemRow.tsx
│   └── OrderCard.tsx
├── utils/
│   ├── format.ts             # 금액 포맷팅 (Intl.NumberFormat)
│   └── storage.ts            # localStorage 헬퍼 (손상 방어 포함)
├── types/
│   └── index.ts              # 도메인 엔티티 타입 정의
├── App.tsx
└── main.tsx
```

---

## 8. 의존성 요약

### 런타임 의존성
| 패키지 | 용도 |
|---|---|
| react, react-dom | UI 프레임워크 |
| react-router-dom | 라우팅 |
| axios | HTTP 클라이언트 |

### 개발 의존성
| 패키지 | 용도 |
|---|---|
| typescript | 타입 시스템 |
| vite | 빌드 도구 |
| tailwindcss, postcss, autoprefixer | 스타일링 |
| jest, @testing-library/react, @testing-library/jest-dom | 테스트 |
| ts-jest | TypeScript Jest 변환 |
| fast-check | Property-Based Testing |
