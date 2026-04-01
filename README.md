# AWS AI-DLC (AI-Driven Development Life Cycle)

AI-DLC는 AI 코딩 에이전트와 함께 체계적으로 소프트웨어를 개발하는 워크플로우 방법론이다.  
이 저장소는 AI-DLC를 학습하고 실습한 내용을 정리한 곳이다.

- 공식 저장소: https://github.com/awslabs/aidlc-workflows

## 디렉토리 구조

```
aws-ai-dlc/
├── base/
│   ├── aidlc-workflows/           # aidlc-workflows 원본 (rules, scripts, docs)
│   └── table-order/               # AI-DLC 시작 직전 셋팅 예시 (rules 복사 + 요구사항 정리 완료 상태)
├── practice/                      # AI-DLC 기반 실습 프로젝트
│   └── 1/                         # 첫 번째 실습 (table-order)
│       ├── aidlc-workflows/
│       └── table-order/
└── README.md
```

- `base/aidlc-workflows/` — AI-DLC Rules 원본 저장소
- `base/table-order/` — Kiro에서 AI-DLC를 시작하기 바로 직전 상태의 예시. rules 복사와 요구사항 문서 정리까지 완료된 스냅샷이다.
- `practice/1/` — base를 바탕으로 실제 AI-DLC 워크플로우를 수행하여 완성한 프로젝트

---

## AI-DLC Workflow 요약

AI-DLC는 3단계 적응형 워크플로우로 동작한다.  
각 단계는 프로젝트 복잡도에 따라 필요한 하위 단계만 선택적으로 실행된다.

### 🔵 INCEPTION (구상) — 무엇을, 왜 만들지 결정

| 하위 단계 | 실행 조건 | 설명 |
|-----------|-----------|------|
| Workspace Detection | 항상 | 워크스페이스 상태 및 프로젝트 타입 분석 |
| Reverse Engineering | 조건부 | 기존 코드베이스 분석 (Brownfield 프로젝트만) |
| Requirements Analysis | 항상 | 요구사항 수집 및 검증 (복잡도에 따라 깊이 조절) |
| User Stories | 조건부 | 유저 스토리 및 페르소나 생성 |
| Workflow Planning | 항상 | 실행 계획 수립 |
| Application Design | 조건부 | 고수준 컴포넌트 식별 및 서비스 레이어 설계 |
| Units Generation | 조건부 | 작업 단위(Unit of Work)로 분해 |

### 🟢 CONSTRUCTION (구현) — 어떻게 만들지 결정하고 실행

| 하위 단계 | 실행 조건 | 설명 |
|-----------|-----------|------|
| Functional Design | 조건부 (Unit별) | 상세 비즈니스 로직 설계 |
| NFR Requirements | 조건부 (Unit별) | 비기능 요구사항 결정 및 기술 스택 선택 |
| NFR Design | 조건부 (Unit별) | NFR 패턴 및 논리적 컴포넌트 반영 |
| Infrastructure Design | 조건부 (Unit별) | 실제 인프라 서비스 매핑 |
| Code Generation | 항상 (Unit별) | 코드 생성 (Planning → Generation) |
| Build and Test | 항상 | 전체 빌드 및 테스트 수행 |

### 🟡 OPERATIONS (운영) — 배포 및 모니터링 (향후 확장)

현재는 placeholder 단계로, 향후 배포 자동화, 모니터링, 프로덕션 준비 검증 등이 추가될 예정이다.

### 핵심 원칙

- 각 단계는 가치를 더할 때만 실행된다 (단순한 변경은 조건부 단계를 건너뜀)
- 복잡한 변경은 INCEPTION + CONSTRUCTION 전체 처리를 받는다
- AI가 구조화된 질문을 던지고, 사용자가 검토/승인하면서 진행한다
- AI가 생성한 모든 계획과 산출물은 반드시 신중히 검토해야 한다
- 모든 산출물은 프로젝트 내 `aidlc-docs/` 디렉토리에 생성된다

---

## 새 프로젝트에서 AI-DLC 시작하기 (Kiro 기준)

### 1. AI-DLC Workflows 저장소 클론

AI-DLC Rules가 포함된 공식 저장소를 클론한다.

- 저장소: https://github.com/awslabs/aidlc-workflows
- 또는 [Releases 페이지](https://github.com/awslabs/aidlc-workflows/releases/latest)에서 zip을 다운로드해도 된다.

```bash
# 적당한 위치에 클론 (이미 있으면 생략)
git clone https://github.com/awslabs/aidlc-workflows.git ~/aidlc-workflows
```

### 2. 프로젝트 디렉토리 생성

```bash
# 프로젝트 디렉토리 생성 (원하는 경로로 변경 가능)
mkdir -p ~/my-project
cd ~/my-project
```

### 3. AI-DLC Rules 복사

클론한 저장소에서 AI-DLC Rules를 프로젝트로 복사한다:

```bash
# .kiro/steering 디렉토리 생성
mkdir -p .kiro/steering

# AI-DLC Rules 복사
cp -R ~/aidlc-workflows/aidlc-rules/aws-aidlc-rules .kiro/steering/
cp -R ~/aidlc-workflows/aidlc-rules/aws-aidlc-rule-details .kiro/
```

### 4. 요구사항 문서 준비 (선택)

AI-DLC에게 처음부터 질문을 받으며 진행할 수도 있지만,  
요구사항 문서를 미리 작성해두면 더 빠르고 정확하게 진행할 수 있다.

```bash
# 요구사항 디렉토리 생성
mkdir -p requirements
```

요구사항 문서는 아래 두 가지를 준비하면 좋다:

1. **요구사항 정의서** (`requirements/my-requirements.md`)  
   만들고 싶은 서비스의 기능을 구체적으로 정리한 문서.  
   프로젝트 개요, 핵심 기능, MVP 범위 등을 포함한다.

2. **제약사항/예외사항** (`requirements/constraints.md`)  
   구현하지 않을 기능을 명시한 문서.  
   AI가 범위를 벗어나지 않도록 가이드하는 역할을 한다.

> 예시는 `base/table-order/requirements/` 를 참고한다.  
> - `table-order-requirements.md` — 서비스 비전, 핵심 기능, MVP 범위를 정의
> - `constraints.md` — 결제, 알림, 주방 기능 등 제외할 항목을 명시

### 5. 디렉토리 구조 확인

여기까지 완료하면 AI-DLC를 시작할 준비가 된 것이다.  
(`base/table-order/` 가 바로 이 상태의 스냅샷이다)

```
my-project/
├── .kiro/
│   ├── steering/
│   │   └── aws-aidlc-rules/          # core workflow 규칙
│   └── aws-aidlc-rule-details/       # 상세 규칙
└── requirements/                     # (선택)
    ├── my-requirements.md            # 요구사항 정의서
    └── constraints.md                # 제약사항/예외사항
```

확인:

```bash
ls -la .kiro/steering/
ls -la .kiro/aws-aidlc-rule-details/
```

### 6. Kiro IDE에서 프로젝트 열기

Kiro IDE의 명령어 `kiro` (Kiro CLI의 명령어 `kiro-cli`와는 다르다)를 이용해서 프로젝트를 연다:

```bash
# 프로젝트 디렉토리에서 Kiro IDE 실행
kiro .
```

> Kiro IDE에서는 Vibe 모드로 AI-DLC를 실행한다.  
> Kiro가 spec 모드로 전환을 제안하면 `No`를 선택하여 Vibe 모드를 유지한다.

### 7. AI-DLC 워크플로우 시작

Kiro 채팅에서 **"Using AI-DLC, ..."** 로 시작하는 문장을 입력하면 워크플로우가 시작된다:

```
Using AI-DLC, requirements/my-requirements.md 를 바탕으로 프로젝트를 시작해줘
```

요구사항 문서 없이 시작할 수도 있다:

```
Using AI-DLC, <만들고 싶은 서비스 설명>
```

이후 AI-DLC가 자동으로:
1. 요구사항 분석 질문을 던짐 → `aidlc-docs/inception/requirements/` 에 정리
2. 유저 스토리 생성 → `aidlc-docs/inception/user-stories/`
3. 애플리케이션 설계 → `aidlc-docs/inception/application-design/`
4. 실행 계획 수립 → `aidlc-docs/inception/plans/`
5. 각 단위별 코드 구현 → `aidlc-docs/construction/`

각 단계마다 사용자 검토와 승인이 필요하다. AI가 제안하고, 사람이 결정하는 구조.

---
