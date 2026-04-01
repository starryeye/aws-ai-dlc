# Unit 3: Admin Frontend - 기술 스택 결정

---

## 핵심 기술 스택

| 영역 | 기술 | 버전 | 근거 |
|---|---|---|---|
| 언어 | TypeScript | 5.x | strict 모드, 타입 안전성 |
| UI 프레임워크 | React | 18.x | 컴포넌트 기반, 풍부한 생태계 |
| 빌드 도구 | Vite | 5.x | 빠른 HMR, ESM 기반 |
| 라우팅 | React Router | 6.x | 중첩 라우팅, lazy loading 지원 |
| 상태 관리 | Context API + useReducer | (내장) | 경량, 추가 의존성 없음 |
| HTTP 클라이언트 | Axios | 1.x | 인터셉터, 에러 핸들링 |
| 실시간 통신 | EventSource | (내장) | SSE 네이티브 지원 |
| CSS | Tailwind CSS | 3.x | 유틸리티 클래스, 빠른 개발 |

---

## 개발 도구

| 도구 | 버전 | 용도 |
|---|---|---|
| Node.js | 20.x LTS | 런타임 |
| npm | 10.x | 패키지 관리 |
| ESLint | 8.x | 코드 린팅 |
| Prettier | 3.x | 코드 포맷팅 |

---

## 테스트 스택

| 도구 | 버전 | 용도 |
|---|---|---|
| Vitest | 1.x | 테스트 러너 (Vite 네이티브) |
| fast-check | 3.x | Property-Based Testing (PBT-09) |
| React Testing Library | 14.x | 컴포넌트 테스트 |
| jsdom | (Vitest 내장) | DOM 환경 |

### PBT 프레임워크 선정 근거 (PBT-09)
- **fast-check**: TypeScript/JavaScript 생태계 최적의 PBT 프레임워크
- 커스텀 제너레이터(Arbitrary) 지원
- 자동 shrinking 지원
- 시드 기반 재현성 지원
- Vitest와 원활한 통합
- 활발한 유지보수 및 문서화

---

## 추가 라이브러리

| 라이브러리 | 용도 | 근거 |
|---|---|---|
| react-hot-toast | 토스트 알림 | 경량, 커스터마이징 용이 |
| @heroicons/react | 아이콘 | Tailwind 생태계, SVG 기반 |

---

## 빌드 설정

### Vite 설정
- 코드 스플리팅: 페이지별 React.lazy + Suspense
- 프록시: 개발 시 /api → 백엔드 서버 프록시
- 환경 변수: VITE_API_BASE_URL

### TypeScript 설정
- strict: true
- target: ES2022
- module: ESNext

### Tailwind 설정
- content: src/**/*.{ts,tsx}
- 커스텀 색상: 주문 상태별 (pending-yellow, preparing-blue, completed-green)

---

## PBT Compliance

### PBT-09: Framework Selection
- **Status**: ✅ Compliant
- **Framework**: fast-check 3.x
- **Integration**: Vitest 테스트 러너와 통합
- **Capabilities**: 커스텀 제너레이터, 자동 shrinking, 시드 재현성 지원
- **Dependency**: package.json devDependencies에 포함 예정
