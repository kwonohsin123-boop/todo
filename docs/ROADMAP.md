# 🗺️ [ROADMAP] 직장인 생산성 TODO 웹앱

> **제품 한 줄 요약**: 오늘 반드시 끝낼 핵심 업무 3개(MIT)를 상단에 고정하고, 나머지 할 일을 타임블록에 배치해 완료율을 눈으로 확인하는 로컬 단일 사용자 웹앱.
>
> **이 문서의 목적**: `docs/기획서_결과.md`(PRD)를 **무엇을 · 어떤 순서로 · 어디까지 하면 끝인지**로 옮긴 실행 계획서입니다. PRD의 §7·§8·§9는 확정 사항이므로 여기서 다시 검토하지 않고 순서와 의존성만 정합니다.
>
> **날짜를 적지 않습니다.** 상대 규모만 `(S)` `(M)` `(L)`로 표기합니다.

---

## 0. 현재 상태 (착수 시점 실측)

검증 시점 **2026-09-22** · 저장소 `C:\workspace\todo` · git `master` 브랜치, **커밋 0건 · 전체 untracked**.

### 0.1 이미 되어 있는 것

| 항목 | 상태 | 근거 |
| :--- | :--- | :--- |
| Next.js 16.3.5 App Router + React 19.2.8 | 설치·동작 | `package.json` |
| Tailwind v4 (설정 파일 없음, 토큰 1곳) | 구성 완료 | `src/app/globals.css` — `@theme inline`(7~48행) · `:root`(53~75행) · `.dark`(88~109행) |
| shadcn 프리미티브 23개 (Base UI 기반) | 생성 완료 | `src/components/ui/` — `button` `card` `checkbox` `dialog` `input` `select` `table` `tabs` 등 |
| 다크 모드 5조각 배선 | 동작 | `globals.css:5` `@custom-variant` + `src/app/layout.tsx`의 `ThemeProvider` · `suppressHydrationWarning` |
| Server Action + `useActionState` + `revalidatePath` 레퍼런스 | 동작 | `src/app/examples/server-actions/actions.ts` ↔ `src/lib/examples/guestbook.ts` |
| 스택 검증 화면 9개 | 동작 | `src/app/examples/**`, 인덱스는 `src/lib/examples/examples-nav.ts` |
| 로케일·타임존 고정 포맷터 | 동작 | `src/lib/examples/timing.ts`의 `formatServerTime` (`ko-KR` / `Asia/Seoul`) |

### 0.2 아직 없는 것

| 항목 | 상태 | 근거 |
| :--- | :--- | :--- |
| **TODO 도메인 기능 전부** | 없음 | `src/app/page.tsx`는 스타터킷 소개 랜딩. MIT·타임블록·진행률 바 코드 없음 |
| **DB 계층** | 없음 | `drizzle-orm` · `better-sqlite3` · `drizzle-kit` 모두 `package.json`에 없음. `src/db/` · `drizzle.config.ts` · `data/` 디렉터리 부재 |
| **`@dnd-kit/*`** | 없음 | `package.json` 미등재 |
| **Pretendard** | 없음 | `src/app/layout.tsx:12`는 여전히 `Geist({ variable: "--font-sans" })` |
| **DESIGN.md 토큰 반영** | 미적용 | `--foreground: oklch(0.145 0 0)`, `--primary: oklch(0.205 0 0)`, `--radius: 0.625rem` — PRD §9.1/§9.4 목표값과 다름 |
| **차트 5색** | 무채색·라이트=다크 동일 | `globals.css:70-74` ↔ `105-109` 값이 같음 |
| **`--radius-xs`** | `@theme`에 없음 | `globals.css:42-48`에 `sm`~`4xl`만 존재 → `rounded-xs`가 `rounded-sm`보다 작은 역전 |
| **테스트 러너** | **없음** | `package.json` scripts에 test 없음. 검증은 `npm run lint` + `npx tsc --noEmit` + `npm run build` + 브라우저 확인뿐 |

### 0.3 검증 수단 (이 문서의 모든 DoD가 이 4가지만 씁니다)

| 수단 | 명령 · 도구 | 주의 |
| :--- | :--- | :--- |
| 린트 | `npm run lint` | `next build`는 린트를 실행하지 않습니다(Next 16). 반드시 따로 |
| 타입 | `npx tsc --noEmit` | 갓 클론한 트리는 `.next/types`가 없어 `PageProps`/`LayoutProps`를 못 찾습니다. **dev 또는 build를 한 번 돌린 뒤** 실행 |
| 빌드 + 프로덕션 확인 | `npm run build && npm run start` | 캐시·`revalidatePath`·LCP는 **`next dev`에서 검증 불가** |
| **동작 테스트** | **Playwright MCP** (`mcp__playwright__*`) | 모든 화면·API 확인은 Playwright MCP로 수행합니다. "눈으로 확인"은 재현되지 않으므로 DoD 통과 근거로 인정하지 않습니다 |

### 0.4 테스트 원칙 (모든 Phase 공통)

**구현만 끝난 작업은 완료가 아닙니다.** 각 Phase의 체크리스트에는 구현 항목과 별도로 `↳ 테스트:` 항목이 있으며, 테스트 항목이 남아 있으면 그 작업은 끝나지 않은 것입니다.

**1. 테스트는 Playwright MCP로 수행합니다.**

| 도구 | 용도 |
| :--- | :--- |
| `browser_navigate` | 대상 경로 열기 |
| `browser_snapshot` | **판정 기준.** 접근성 트리의 텍스트·역할(role)로 확인 |
| `browser_click` · `browser_type` · `browser_fill_form` | 폼 제출 · 서버 액션 호출 |
| `browser_press_key` | 단축키와 키보드 전용 조작 경로 |
| `browser_network_request` | Route Handler 직접 호출 — 상태 코드 · 응답 본문 |
| `browser_console_messages` | 콘솔 회귀 확인 |

판정은 스크린샷의 인상이 아니라 `browser_snapshot`의 텍스트·role 또는 네트워크 응답으로 합니다.

**2. API 연동·비즈니스 로직은 네 축을 모두 검증합니다.**

데이터 계층, 서버 액션, Route Handler, 도메인 규칙(MIT 3개 제한 · `mit_order` 재배치 · 완료 토글 · 진행률 계산)처럼 **틀렸을 때 에러 없이 잘못된 값이 남는 작업**은 정상 경로 하나만 보고 통과시키지 않습니다.

| 축 | 무엇을 확인하는가 |
| :--- | :--- |
| 정상 경로 | 대표 입력 1건이 기대한 결과를 만든다 |
| 경계값 | 한계 직전·직후(MIT 2개/3개/4개), 빈 값, 최대 길이, `start_min` 0과 음수 |
| 실패 경로 | 제약 위반이 **거부되고 사유가 화면에 보인다**(throw가 아니라 상태 객체 반환) |
| 영속성 | 새로고침 후에도 상태가 유지되고, 거부된 시도는 **행을 남기지 않는다** |

화면이 맞아 보여도 행이 틀릴 수 있으므로, 쓰기 동작은 확인 후 `npx drizzle-kit studio`로 **DB에 실제로 무엇이 남았는지** 다시 봅니다.

**3. 캐시·`revalidatePath`·LCP가 걸린 테스트는 `npm run build && npm run start` 위에서** Playwright MCP로 수행합니다. `next dev`는 매 요청 재렌더하므로 차이가 드러나지 않습니다.

**4. 콘솔 확인을 매 Phase DoD에 포함합니다.** `/examples/components`의 의도된 Avatar 404 한 건 외에 콘솔 에러가 있으면 회귀입니다.

**5. 테스트 시나리오는 PRD의 Given-When-Then에서 가져옵니다.** 수용 조건을 새로 지어내지 않습니다.

---

## 1. 범위 밖 (Won't-have / 비대상)

아래는 **하지 않습니다.** 로드맵 어느 Phase에도 등장하지 않으며, 요청이 들어오면 PRD 개정이 먼저입니다.

| 제외 대상 | 근거 |
| :--- | :--- |
| 복잡한 다중 팀원 칸반보드 | PRD §4 Won't-have |
| 권한 · 역할 관리 | PRD §4 Won't-have |
| 로그인 · 세션 · `users` 테이블 | PRD §7.2 "인증은 두지 않습니다" (로컬 단일 사용자 전제) |
| 별도 백엔드 서버(Supabase · Express 등) | PRD §7.2 "분리된 백엔드를 두지 않습니다" |
| 배포 · 호스팅 · CI/CD · 도메인 · 환경변수 관리 | PRD §7.4 "이 앱은 배포하지 않습니다" |
| KakaoBank Yellow `#FFE300` 등 브랜드 자산 차용 | PRD §9.5 |
| 90px 히어로 타입 스케일, 금융 전용 컴포넌트 | PRD §9.5 |
| **유닛 테스트 러너**(Jest · Vitest) 도입 | PRD·CLAUDE.md 모두 검증 수단을 lint/tsc/build로 규정. 도입하려면 별도 결정 필요. **동작 테스트는 Playwright MCP로 수행하며 이는 범위 밖이 아니라 모든 Phase의 필수 절차입니다**(§0.4) |

또한 **`/examples` 9개 화면과 `src/app/api/` 4개 Route Handler는 삭제하지 않습니다.** 스택이 깨졌을 때 드러내는 검증 자산이며, M0의 토큰·폰트 변경을 확인하는 수단이 바로 이 화면들입니다(CLAUDE.md, PRD §9.7).

---

## 2. 마일스톤 개요와 의존성

| Phase | 목표 | MoSCoW | 규모 | 선행 |
| :--- | :--- | :--- | :---: | :--- |
| **M0** | 디자인 기반(색·폰트·반경)을 DESIGN.md 기준으로 맞춘다 | — | M | 없음 |
| **M1** | 오늘의 MIT 3개를 등록하고 완료 체크와 진행률을 눈으로 본다 | Must ①③ | L | M0 |
| **M2** | 할 일을 단축키로 빠르게 넣고 타임라인에 드래그해 배치한다 | Must ② | L | M1 |
| **M3** | MVP를 프로덕션 빌드에서 마감한다(성능·키보드·회귀) | Must 마감 | M | M2 |
| **M4** | 작업에 쓴 집중 시간을 뽀모도로로 측정한다 | Should ① | M | M3 |
| **M5** | 주간/월간 완료율과 몰입 시간을 본다 | Should ② | M | M4 |
| **백로그** | Could-have (Google Calendar / Slack 연동) | Could | — | M5 |

### 2.1 무엇이 무엇을 막는가

```
M0 디자인 토큰 ──┐
                 ├─→ M1 DB 스키마 → 마이그레이션 → lib/tasks.ts → actions.ts → UI
                 │        │
                 │        └─→ M2 타임블록 DnD (start_min·duration_min 컬럼 필요)
                 │                   │
                 │                   └─→ M3 마감 → M4 focus_sessions → M5 리포트
                 └─→ (UI를 먼저 만들면 색·반경·폰트 교체 시 전량 재확인 필요)
```

| 막는 것 | 막히는 것 | 이유 |
| :--- | :--- | :--- |
| 디자인 토큰·폰트·반경 교체 (M0) | 모든 UI 작업 | 나중에 바꾸면 만든 화면을 전부 다시 눈으로 확인해야 합니다. 토큰은 **빌드 에러 없이 조용히 실패**하므로 화면이 늘수록 검증 비용이 커집니다 |
| DB 스키마 + 마이그레이션 (M1) | `src/lib/tasks.ts`, `src/app/actions.ts`, 모든 화면 | 행 타입이 스키마에서 추론됩니다. 스키마 없이 액션을 쓰면 타입이 전부 임시값이 됩니다 |
| `src/lib/tasks.ts` (조회·타입·초기 상태) | `src/app/actions.ts` | `'use server'` 파일은 **모든 export가 async 함수**여야 해서 타입·상수를 둘 수 없습니다 (`guestbook.ts` 분리와 동일한 이유, PRD §8.1) |
| `tasks.start_min` / `duration_min` (M1 스키마) | M2 타임블록 배치 | 드롭 결과를 저장할 컬럼이 M1 스키마에 이미 들어 있어야 M2에서 마이그레이션을 다시 만들지 않습니다 |
| M1 진행률 바 | M5 리포트 | 완료율 계산 로직을 `lib/tasks.ts`에서 재사용합니다 |
| `focus_sessions` 테이블 (M4) | M5 리포트의 "몰입 시간" 계열 | PRD §8.3 — 두 기능이 이 테이블 하나를 공유합니다 |
| **막지 않는 것**: 차트 5색 (§9.2) | — | 리포트(M5) 전까지 불필요합니다. M0에서 같이 해도 되지만 **급하지 않습니다** |

---

## M0 — 디자인 기반 정비

**목표**: 앞으로 만들 모든 화면이 처음부터 DESIGN.md의 색·타이포·반경 위에서 그려지게 한다.

**선행 조건**: 없음. 가장 먼저 착수합니다.

### 작업 체크리스트

- [ ] `src/app/globals.css`의 `:root` 중성 토큰 5종을 PRD §9.1 값으로 교체 — `--foreground` `--primary` → `oklch(0 0 0)`, `--muted`/`--secondary`/`--accent` → `oklch(0.976 0 0)`, `--border`/`--input` → `oklch(0.925 0 0)`, `--muted-foreground` → `oklch(0.387 0 0)` **(S)**
- [ ] `.dark`의 중성 토큰은 **건드리지 않는다**는 결정을 주석으로 남기기 (PRD §9.1: DESIGN.md가 다크 값을 규정하지 않음) — `src/app/globals.css` **(S)**
- [ ] `--radius`를 `0.625rem` → `0.375rem`으로 낮추기 — `src/app/globals.css:75` **(S)**
- [ ] `@theme inline`에 `--radius-xs: calc(var(--radius) * 0.4)` 추가 (현재 `sm`~`4xl`만 있어 `rounded-xs`가 `rounded-sm`보다 작은 역전 상태) — `src/app/globals.css:42-48` **(S)**
- [ ] `npm i pretendard` 후 Variable woff2를 `src/fonts/`로 복사 **(S)**
- [ ] `next/font/local`로 Pretendard 로드, **CSS 변수명은 `--font-sans` 그대로 유지**, `Geist` import 제거, `Geist_Mono`(`--font-geist-mono`)는 존치 — `src/app/layout.tsx:1-20` **(M)**
- [ ] `data/` 산출물과 폰트 바이너리 제외 규칙 정리 — `.gitignore`에 `/data/` 추가 (PRD §8.1: DB 파일은 커밋하지 않음) **(S)**
- [ ] 타입 스케일 4단계(32/700 · 24/700 · 16/400 · 14/600)를 앞으로 쓸 유틸리티 조합으로 정하고 M1 헤딩에 적용할 기준을 결정 (PRD §9.3 표) **(S)**

**테스트 (Playwright MCP)**

- [ ] ↳ 테스트: `/examples/theme`을 열어 라이트 computed 값 표에서 `--foreground`·`--primary`·`--muted-foreground`를 `browser_snapshot`으로 읽어 목표값과 대조 **(S)**
- [ ] ↳ 테스트: `browser_click`으로 다크 토글 후 같은 표를 다시 읽어 `.dark` 중성 토큰이 변경 전과 동일한지 확인 **(S)**
- [ ] ↳ 테스트: `/examples/theme`의 radius 스케일에서 `rounded-xs < sm < md < lg` 순서와 `rounded-lg` = 6px 확인 **(S)**
- [ ] ↳ 테스트: `/examples/assets`의 폰트 실측 표에서 `font-sans`에 Pretendard가, `font-mono`에 Geist Mono가 나타나는지 확인 **(S)**
- [ ] ↳ 테스트: `/`·`/examples` 9개 화면을 순회하며 `browser_console_messages`로 콘솔 회귀 확인 (의도된 Avatar 404 1건 제외) **(S)**

### 완료 기준 (DoD)

- `npm run lint` · `npx tsc --noEmit` · `npm run build` 3개가 모두 오류 없이 끝난다.
- `/examples/theme`의 computed 값 비교표에서 라이트의 `--foreground`와 `--primary`가 **`oklch(0 0 0)` 계열(rgb(0, 0, 0))** 로 읽히고, `--muted-foreground`가 `#444444` 계열로 읽힌다.
- `/examples/theme`의 radius 스케일에서 `rounded-xs < rounded-sm < rounded-md < rounded-lg` **순서가 역전 없이** 표시되고, `rounded-lg`가 6px이다.
- `/examples/assets`의 폰트 실측 표에서 `font-sans`의 적용 family에 **Pretendard가 나타난다**(시스템 폰트 폴백이 아님). `font-mono`는 Geist Mono 유지.
- 다크 모드 토글 후에도 `/examples/theme`가 깨지지 않고, `.dark` 중성 토큰 값이 변경 전과 동일하다.
- 한글 텍스트가 있는 화면(`/`, `/examples`)에서 글꼴이 Pretendard로 렌더된다(`/examples/assets`의 실측 표를 `browser_snapshot`으로 확인 — 개발자도구 육안 확인으로 대체하지 않습니다).
- **위 테스트 항목 5개를 Playwright MCP로 전부 수행해 통과했고, 콘솔에 의도된 1건 외 에러가 없다.**

### 위험 · 주의

- **색 토큰은 세 곳을 함께 고쳐야 합니다** (`:root` · `.dark` · `@theme inline`). 이번 작업은 기존 토큰의 **값만** 바꾸므로 `@theme inline` 항목 추가는 `--radius-xs` 하나뿐입니다. 새 토큰을 만들면 세 곳 규칙이 다시 적용됩니다.
- 하나라도 빠뜨리면 **빌드 에러 없이 조용히 실패**합니다. 반드시 `/examples/theme`의 실측 값으로 확인하세요.
- `--font-sans` 변수명을 바꾸면 `@theme inline`의 `--font-sans: var(--font-sans)`와 `html { @apply font-sans }`가 끊겨 **폰트가 조용히 적용되지 않습니다** (`src/app/layout.tsx:12`의 비표준 배선이 정확히 이 이유로 존재합니다).
- `shadow-*`는 앱 화면에서 쓰지 않되, `dropdown-menu`·`popover`·`select`·`tabs` 4개 CLI 생성 파일의 기본 그림자는 **손대지 않습니다** (PRD §9.4).
- 차트 5색(§9.2)은 이 Phase에서 **하지 않습니다.** M5에서 리포트와 함께 넣습니다.

---

## M1 — 데이터 계층 + 오늘의 MIT 수직 슬라이스

**목표**: 사용자가 메인 화면에서 오늘의 핵심 업무 3개를 등록하고, 체크해서 완료하고, 진행률이 올라가는 것을 볼 수 있다.

**선행 조건**: M0 완료(토큰·폰트 교체 후 UI 착수).

> 이 Phase는 **얇은 수직 슬라이스**입니다. "DB 전부 → 액션 전부 → UI 전부"가 아니라, 화면에서 실제로 동작하는 MIT 등록·완료 흐름 하나를 끝까지 관통시킵니다. Must-have ①(MIT 3개 지정)과 ③(완료 체크·진행률 바)이 여기서 끝납니다.

### 작업 체크리스트

**A. 의존성과 스키마 (이후 작업 전부를 막습니다)**

- [ ] `npm i drizzle-orm better-sqlite3` / `npm i -D drizzle-kit @types/better-sqlite3` (PRD §7.3) **(S)**
- [ ] 설치 직후 `node -e "require('better-sqlite3')"`로 네이티브 모듈이 이 Node 버전에서 로드되는지 확인 **(S)**
- [ ] `drizzle.config.ts` 작성 — 스키마 경로 `src/db/schema.ts`, DB 파일 `data/todo.db` **(S)**
- [ ] `src/db/schema.ts` — `tasks` 테이블을 PRD §8.2 표 그대로 정의(11개 컬럼). `done_at`은 **NULL 여부가 곧 완료 상태**, 별도 boolean 컬럼 없음. 행 타입 `export type` 포함 **(M)**
- [ ] `tasks`에 `UNIQUE(planned_date, mit_order)` + `CHECK (mit_order IN (0,1,2))` 제약 반영 (PRD §8.2) **(M)**
- [ ] `src/db/client.ts` — `better-sqlite3` 연결. **dev HMR 대비 `globalThis` 싱글턴** (PRD §8.4) **(M)**
- [ ] `npx drizzle-kit generate` → `npx drizzle-kit migrate`로 `data/todo.db` 생성, 생성된 마이그레이션 SQL에 위 두 제약이 실제로 들어갔는지 눈으로 확인 **(S)**
- [ ] `npx drizzle-kit studio`로 `tasks` 테이블이 보이는지 확인 **(S)**

**B. 데이터 계층 (액션을 막습니다)**

- [ ] `src/lib/tasks.ts` — 조회 함수(오늘 날짜의 MIT 목록·일반 할 일 목록), 완료율 계산, `YYYY-MM-DD` 오늘 날짜 산출, 폼 상태 타입과 초기값 (`guestbook.ts` 구조 그대로) **(L)**
- [ ] 시간 표기는 `ko-KR` / `Asia/Seoul` 고정 포맷으로 통일 — `src/lib/examples/timing.ts`의 `formatServerTime` 방식을 따르는 헬퍼를 `src/lib/tasks.ts`에 둠 **(S)**

**C. Server Action**

- [ ] `src/app/actions.ts` — `'use server'`, **async 함수만 export**. 할 일 생성 / MIT 지정·해제 / 완료 토글 **(L)**
- [ ] 각 액션 안에서 **MIT 3개 제한을 서버측에서 재검증** (직접 POST 대비, PRD §8.2) **(M)**
- [ ] 모든 액션은 예외를 throw하지 않고 **상태 객체를 반환**하고 `revalidatePath("/")` 호출 (PRD §8.4) **(M)**

**D. 화면 (수직 슬라이스 관통)**

- [ ] `src/app/page.tsx`를 스타터킷 랜딩에서 **앱 메인 화면(Server Component)** 으로 교체 — `src/lib/tasks.ts` 직접 호출로 데이터 읽기 **(L)**
- [ ] MIT 영역 컴포넌트 — 상단 고정 · 큰 글자 · 굵은 weight · `--muted` 섹션 서피스로 영역 구분, 색 액센트 사용 안 함 (PRD §9.6) **(M)**
- [ ] 할 일 입력 폼 — `"use client"` 파일로 분리, `useActionState(action, initial)` 사용, 반환값은 `[state, formAction, isPending]` **(M)**
- [ ] 완료 체크박스 — `"use client"` 파일, `src/components/ui/checkbox.tsx` 사용, 토글 시 Server Action 호출 **(M)**
- [ ] 진행률 바 — 완료/전체 비율을 `--primary`(검정)로 표시, 숫자 라벨 병기 (색만으로 정보 전달 금지) **(M)**
- [ ] `src/components/layout/site-header.tsx`의 nav를 앱 기준으로 정리(`홈`은 앱 화면, `예제`·`아이콘`은 유지) **(S)**

**E. 테스트 (Playwright MCP) — 구현 후 반드시 수행**

> 이 Phase는 비즈니스 로직(MIT 3개 제한)과 데이터 영속성이 처음 들어오는 구간입니다. §0.4의 **네 축(정상·경계값·실패·영속성)** 을 전부 적용합니다.

- [ ] ↳ 테스트(정상): `browser_fill_form`으로 할 일 5개 등록 → `browser_snapshot`에 5개 항목이 보이고, 3개를 MIT로 지정하면 상단 MIT 영역에 표시됨 **(M)**
- [ ] ↳ 테스트(경계값): MIT 2개 → 3개까지는 지정되고, **4번째 지정 시도는 거부되며 사유 문구가 스냅샷에 나타남**. 이때 화면의 MIT 항목 수는 3개 유지 **(M)**
- [ ] ↳ 테스트(경계값): 빈 제목 · 공백만 입력 · 과도하게 긴 제목 제출 시 거부되고 사유가 표시됨 **(S)**
- [ ] ↳ 테스트(실패 경로): 거부 시 예외 페이지(`error.tsx`)로 떨어지지 않고 **폼 자리에 상태 메시지로 표시**되는지 확인 **(S)**
- [ ] ↳ 테스트(영속성): `browser_navigate`로 새로고침 후 MIT 지정·완료 상태·목록 순서가 그대로인지 확인. 거부된 4번째 시도가 **행으로 남지 않았는지** `npx drizzle-kit studio`로 대조 **(M)**
- [ ] ↳ 테스트(진행률): 5개 중 2개 완료 체크 → 진행률 바가 40%, 숫자 라벨이 "2/5"로 스냅샷에 보임. 체크 해제 시 원복 **(S)**
- [ ] ↳ 테스트(완료 토글): 체크 후 `drizzle-kit studio`에서 `done_at`에 값이 들어가고, 해제 시 `NULL`로 돌아오는지 확인 **(S)**
- [ ] ↳ 테스트(키보드): `browser_press_key`만으로 입력 → 등록 → MIT 지정 → 완료 체크 전 과정 수행 **(M)**
- [ ] ↳ 테스트(캐시): `npm run build && npm run start` 위에서 할 일 추가 시 새로고침 없이 목록에 반영되는지 확인(`revalidatePath` 검증 — **dev에서는 판별 불가**) **(M)**
- [ ] ↳ 테스트(회귀): `/examples` 9개 화면 순회 + `browser_console_messages`로 콘솔 확인 **(S)**

### 완료 기준 (DoD)

**기능 — PRD §5 수용 조건을 검증 가능한 문장으로**

- `/`에서 할 일을 입력하고 'MIT 지정'을 누르면 해당 항목이 **최상단 MIT 영역에 강조 표시**되고, 목록 순서가 유지된 채 새로고침해도 남아 있다.
- MIT가 이미 3개일 때 4번째를 MIT로 지정하려 하면 **등록이 거부되고 화면에 사유 메시지가 표시된다.** 이때 DB의 해당 날짜 MIT 행 수는 `drizzle-kit studio`에서 여전히 3개다.
- MIT를 해제하면 `mit_order`가 `NULL`이 되어 일반 할 일 목록으로 내려가고, 비워진 자리에 다른 할 일을 MIT로 지정할 수 있다.
- 완료 체크박스를 누르면 `done_at`에 값이 채워지고, 다시 누르면 `NULL`로 돌아간다 (`drizzle-kit studio`로 확인).
- 전체 5개 중 2개를 완료하면 진행률 바가 **40%로 표시되고 숫자 라벨에도 "2/5"에 해당하는 값이 함께 보인다.**
- MIT 3개 제한이 **UI를 거치지 않은 직접 요청에서도 막힌다** — 서버 액션 본문에 제한 검증 코드가 존재함을 코드로 확인. (UI 테스트만으로 통과시키지 않습니다.)
- **위 "E. 테스트" 10개 항목을 Playwright MCP로 전부 수행해 통과했고, 각 항목의 판정 근거(`browser_snapshot` 내용 또는 `drizzle-kit studio`의 행)를 보고에 남겼다.**

**비기능 (PRD §6) — 이 Phase에서 확인**

- `npm run build && npm run start` 후 `/`를 열었을 때 브라우저 개발자도구 Performance 패널의 **LCP가 1초 이내**로 측정된다. (`next dev`에서 측정하지 않습니다.)
- 마우스를 쓰지 않고 **키보드만으로** 할 일 입력 → 등록 → MIT 지정 → 완료 체크까지 전 과정이 가능하다(Tab 순서와 포커스 링이 모든 조작 요소에 존재).

**기술 검증**

- `npm run lint` · `npx tsc --noEmit` · `npm run build` 전부 오류 없음. (새 라우트·페이지 추가 후이므로 **dev 또는 build를 한 번 돌린 뒤** `tsc`를 실행합니다.)
- `npm run build && npm run start` 상태에서 할 일을 추가하면 **새로고침 없이 목록에 반영된다** (`revalidatePath("/")` 동작 확인 — dev에서는 구분되지 않습니다).
- `/examples` 9개 화면이 모두 기존대로 열리고, `/examples/components`의 의도된 Avatar 404 한 건 외에 **콘솔에 새 에러가 없다**(`browser_console_messages`로 확인).

### 위험 · 주의

| 위험 | 대응 |
| :--- | :--- |
| `'use server'` 파일에서 타입·상수를 export하면 빌드 실패 | 타입과 초기 상태는 반드시 `src/lib/tasks.ts`에 (`guestbook.ts`와 동일 구조) |
| `next dev` HMR이 모듈을 재평가할 때마다 새 SQLite 연결 → 파일 락 / `SQLITE_BUSY` | `src/db/client.ts`에서 `globalThis` 싱글턴 (PRD §8.4) |
| 컴포넌트 본문의 `Date.now()` → ESLint `react-hooks/purity` **error** | 오늘 날짜 계산은 Server Action 또는 `src/lib/tasks.ts`의 모듈 스코프 함수에서만 |
| 서버/클라이언트 날짜 포맷 차이 → 하이드레이션 불일치 | `ko-KR` / `Asia/Seoul` 고정 포맷 |
| `better-sqlite3` 네이티브 모듈이 이 Node 버전에서 빌드/로드되지 않을 가능성 (최신 13.0.3의 `engines`는 `node >=22`라 v24.21.0은 범위 안. 다만 win32 프리빌드 존재 여부는 **미확인**) | 설치 직후 `node -e "require('better-sqlite3')"` 한 줄로 먼저 확인하고, 실패하면 그 자리에서 보고 |
| drizzle-kit이 `CHECK` 제약을 생성 SQL에 넣지 못할 가능성 (**미확인**) | 생성된 마이그레이션 SQL을 열어 확인. 없으면 해당 SQL 파일에 직접 추가하고, 애플리케이션 검증(서버 액션)은 어느 경우에도 필수 |
| 새 라우트·페이지 추가 후 `PageProps`/`LayoutProps` 전역 타입 미갱신 → `tsc` 오류 | dev 또는 build를 한 번 돌린 뒤 타입 체크 |
| UI 프리미티브를 새로 추가할 때 기존 파일 덮어쓰기 | `npx shadcn@latest add <name> --dry-run`으로 먼저 확인. **`field`는 `label`·`separator`를 덮어쓰므로 추가하지 않습니다** |

---

## M2 — 빠른 등록 · 단축키 · 타임블록 배치

**목표**: 손을 키보드에서 떼지 않고 할 일을 넣고, 타임라인 그리드에 드래그해 하루 일정을 짠다.

**선행 조건**: M1 완료. 특히 `tasks.start_min` / `duration_min` 컬럼과 Server Action 흐름이 있어야 합니다.

### 작업 체크리스트

- [ ] `npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers @dnd-kit/utilities` (PRD §7.5) **(S)**
- [ ] 타임라인 그리드 컴포넌트 — `"use client"`, 자정 기준 분 단위 좌표를 시각 눈금으로 환산 **(L)**
- [ ] 할 일 목록 ↔ 타임라인 드롭 — `@dnd-kit/core`, 드롭 시 `start_min` 저장 Server Action 호출 **(L)**
- [ ] 격자 스냅과 축 고정 — `@dnd-kit/modifiers` **(M)**
- [ ] MIT 3개 순서 재배치 — `@dnd-kit/sortable`로 `mit_order` 갱신, 저장 시 `UNIQUE(planned_date, mit_order)` 충돌이 나지 않도록 순서 갱신 로직을 한 액션 안에서 처리 **(L)**
- [ ] `KeyboardSensor` 연결 + 스크린리더 안내 문구 — 키보드만으로 드래그 시작·이동·드롭 가능하게 (PRD §7.5의 선정 근거) **(M)**
- [ ] 전역 단축키 — 입력창 포커스, 완료 토글, MIT 지정 등 (PRD §6 "단축키 중심의 빠른 입력 UX"). 키맵 정의는 `src/lib/tasks.ts` 또는 별도 상수 모듈, 바인딩은 `"use client"` 파일 **(M)**
- [ ] 단축키 목록을 화면에서 볼 수 있게(`src/components/ui/dialog.tsx` 사용, Base UI `render` prop 합성) **(M)**
- [ ] 타임블록 위치·길이 변경을 저장하는 Server Action 추가 — `src/app/actions.ts` **(M)**

**테스트 (Playwright MCP) — 구현 후 반드시 수행**

- [ ] ↳ 테스트(정상): `browser_drag`로 할 일을 타임라인 09:00에 드롭 → `drizzle-kit studio`에서 `start_min`이 `540`인지 확인 **(M)**
- [ ] ↳ 테스트(영속성): 새로고침 후에도 같은 자리에 표시되는지 `browser_snapshot`으로 확인 **(S)**
- [ ] ↳ 테스트(경계값): 00:00 · 23:30 등 그리드 양끝에 드롭했을 때 `start_min`이 범위를 벗어나거나 음수가 되지 않는지 확인 **(M)**
- [ ] ↳ 테스트(경계값·충돌): MIT 순서를 **연속으로 여러 번** 바꾼 뒤 같은 `planned_date`에 중복 `mit_order`가 없고 `0,1,2`로 재배열되는지 `drizzle-kit studio`로 확인 (`UNIQUE` 중간 상태 충돌 재현) **(L)**
- [ ] ↳ 테스트(키보드): `browser_press_key`만으로 드래그 시작 → 방향키 이동 → 드롭까지 수행해 동일한 배치 결과가 나오는지 확인 **(M)**
- [ ] ↳ 테스트(접근성): 드래그 중 스크린리더 안내 문구가 live region에 출력되는지 `browser_snapshot`으로 확인 **(S)**
- [ ] ↳ 테스트(단축키): 단축키로 입력창 포커스 → 바로 등록. 도움말 다이얼로그를 열고 Esc로 닫은 뒤 포커스가 원위치로 돌아오는지 확인 **(M)**
- [ ] ↳ 테스트(회귀): `browser_console_messages`로 dnd-kit 도입 후 콘솔 에러 유입 여부 확인 **(S)**

### 완료 기준 (DoD)

- 할 일 항목을 마우스로 타임라인 09:00 자리에 드롭하면 `start_min`이 `540`으로 저장되고, 새로고침 후에도 같은 자리에 표시된다 (`drizzle-kit studio`로 값 확인).
- **마우스를 전혀 쓰지 않고** 키보드만으로 같은 배치를 완료할 수 있다: 드래그 대상에 Tab으로 포커스 → 드래그 시작 키 → 방향키 이동 → 드롭 키.
- 드래그 중 스크린리더용 안내 텍스트가 DOM에 출력된다(개발자도구에서 live region 확인).
- MIT 3개의 순서를 바꾸면 `mit_order`가 `0,1,2`로 **중복 없이** 재배열되고, 같은 날짜에 같은 `mit_order`를 가진 행이 생기지 않는다.
- 단축키 하나로 입력창에 포커스가 가고, 목록을 거치지 않고 바로 할 일을 추가할 수 있다.
- 단축키 도움말을 열고 Esc로 닫을 수 있으며, 닫힌 뒤 포커스가 원래 위치로 돌아온다.
- `npm run lint` · `npx tsc --noEmit` · `npm run build` 전부 오류 없음.
- `npm run build && npm run start`에서 `/`의 **LCP가 1초 이내**로 유지된다(dnd-kit 추가 후 회귀 확인).
- **위 테스트 8개 항목을 Playwright MCP로 전부 수행해 통과했고, 콘솔에 의도된 1건 외 에러가 없다.**

### 위험 · 주의

- **dnd-kit은 클라이언트 전용입니다.** 타임라인과 MIT 목록 컴포넌트는 `"use client"` 파일이어야 하고, 이를 감싸는 `page.tsx`는 Server Component로 둡니다 (PRD §7.5, 저장소 관례).
- `react-hooks/refs` 규칙이 **error**입니다. 렌더 중 `ref.current` 읽기·쓰기를 하는 드래그 예제 코드를 그대로 옮기면 린트에서 막힙니다.
- `react-hooks/set-state-in-effect` — 이펙트 본문의 무조건 `setState` 금지. 드래그 상태 동기화가 필요하면 `useSyncExternalStore` 또는 조건부 DOM 측정으로.
- Base UI는 `asChild`가 아니라 **`render` prop**, 열림 상태는 `data-state="open"`이 아니라 **`data-open`** 입니다. 웹의 Radix 기준 예제를 그대로 붙이면 동작하지 않습니다.
- MIT 순서 재배치는 `UNIQUE(planned_date, mit_order)` 때문에 **중간 상태에서 충돌**할 수 있습니다. 한 트랜잭션 안에서 처리하거나 임시값을 거치는 순서로 갱신하세요.

---

## M3 — MVP 마감

**목표**: Must-have 3개가 프로덕션 빌드에서 처음부터 끝까지 끊김 없이 동작한다.

**선행 조건**: M1 · M2 완료.

### 작업 체크리스트

- [ ] 빈 상태 화면 — 할 일이 하나도 없는 날의 `/` 표시 **(M)**
- [ ] 날짜 경계 처리 — `planned_date`가 오늘이 아닌 항목이 섞여 보이지 않는지 점검 (`src/lib/tasks.ts`) **(M)**
- [ ] 서버 액션 실패 경로 점검 — 빈 제목, 과도한 길이, 존재하지 않는 id에 대해 **상태 객체 반환**(throw 아님) 확인 **(M)**
- [ ] ↳ 테스트: 위 3가지 실패 입력을 Playwright MCP로 실제 제출해 `error.tsx`로 떨어지지 않고 사유가 화면에 남는지 확인 **(M)**
- [ ] 접근성 전수 확인 — 모든 조작 요소의 포커스 링, `aria-invalid`, 진행률 바의 접근성 이름 **(M)**
- [ ] 메타데이터 정리 — `src/app/layout.tsx`의 `title`/`description`을 제품명으로 교체 **(S)**
- [ ] `/examples` 9개 화면 회귀 확인 및 콘솔 점검 **(S)**
- [ ] 첫 커밋 정리 — 현재 전 파일이 untracked 상태이므로 기준선을 만든다 (`data/todo.db` 제외 확인) **(S)**

**테스트 (Playwright MCP) — MVP 전 구간 통합 시나리오**

> M3의 테스트는 **`npm run build && npm run start` 위에서, 빈 DB로 시작해** 수행합니다. dev에서 통과한 것은 이 Phase의 근거가 되지 않습니다.

- [ ] ↳ 테스트(통합·마우스): 할 일 5개 등록 → 3개 MIT 지정 → 4번째 MIT 지정 거부 확인 → 타임라인에 3개 배치 → 2개 완료 체크 → 진행률·숫자 라벨 갱신 → 새로고침 후 전 상태 유지, 각 단계를 `browser_snapshot`으로 기록 **(L)**
- [ ] ↳ 테스트(통합·키보드): 위 시나리오 전체를 `browser_press_key`만으로 반복 **(L)**
- [ ] ↳ 테스트(빈 상태): 새 DB로 `/`를 열었을 때 빈 화면이 아니라 다음 행동 안내 문구가 스냅샷에 나타나는지 확인 **(S)**
- [ ] ↳ 테스트(날짜 경계): `planned_date`가 어제/내일인 행을 `drizzle-kit studio`로 직접 넣고, `/`에 섞여 보이지 않는지 확인 **(M)**
- [ ] ↳ 테스트(회귀): `/examples` 9개 화면 + `/api/time`·`/api/cached-time`을 `browser_network_request`로 호출해 상태 코드와 캐시 동작 대조, `browser_console_messages`로 콘솔 확인 **(M)**

### 완료 기준 (DoD)

- `npm run build && npm run start` 상태에서 **새 DB 파일로 시작해** 다음 시나리오가 끊김 없이 완료된다: 할 일 5개 등록 → 3개를 MIT로 지정 → 4번째 MIT 지정 시도가 사유와 함께 거부됨 → 타임라인에 3개 배치 → 2개 완료 체크 → 진행률 바와 숫자 라벨이 함께 갱신 → 새로고침 후 모든 상태 유지.
- 위 시나리오 전체를 **키보드만으로** 다시 수행할 수 있다.
- `/`의 LCP가 프로덕션 빌드에서 1초 이내.
- 할 일이 0개일 때 `/`가 빈 화면이 아니라 다음 행동을 안내하는 문구를 표시한다.
- `npm run lint` · `npx tsc --noEmit` · `npm run build` 전부 오류 없음.
- `/examples` 9개 화면과 `/api/time` · `/api/cached-time`이 모두 기존대로 동작하고, 콘솔에 의도된 1건(`/examples/components`의 Avatar 404) 외 에러가 없다.
- `git status`에 `data/todo.db`가 나타나지 않는다.
- **위 테스트 5개 항목을 프로덕션 빌드 위에서 Playwright MCP로 전부 수행해 통과했다.** 통합 시나리오는 마우스 경로와 키보드 경로 **양쪽 모두** 통과해야 합니다.

### 위험 · 주의

- `notFound()`는 dev에서 "Encountered a script tag while rendering React component" 오류를 남깁니다. **Next.js 자체 동작이고 프로덕션 빌드에서는 나오지 않습니다.** 쫓지 마세요.
- `Alert` 안에 긴 URL이나 코드 블록을 넣으면 가로 스크롤이 생깁니다. `src/components/ui/alert.tsx`는 이미 `minmax(0,1fr)`로 고쳐져 있으나 **`shadcn add alert`로 재생성하면 되돌아갑니다.**

---

## M4 — 집중 모드 (뽀모도로) · Should-have

**목표**: 작업 하나를 골라 집중 타이머를 돌리고, 거기에 쓴 시간이 기록으로 남는다.

**선행 조건**: M3 완료 (MVP가 프로덕션 빌드에서 검증된 뒤 착수).

### 작업 체크리스트

- [ ] `src/db/schema.ts`에 `focus_sessions` 테이블 추가 — PRD §8.3 (`id` · `task_id` FK → `tasks.id` · `kind`(`focus`\|`break`) · `started_at` · `ended_at`) **(M)**
- [ ] `npx drizzle-kit generate` → `migrate`로 마이그레이션 적용 **(S)**
- [ ] 세션 시작·종료 Server Action — `src/app/actions.ts` **(M)**
- [ ] 세션 조회 함수 — `src/lib/tasks.ts` 또는 `src/lib/focus.ts` **(M)**
- [ ] 타이머 UI — `"use client"`, 남은 시간 표시. **컴포넌트 본문에서 `Date.now()`·`performance.now()` 호출 금지** **(L)**
- [ ] 타이머 종료 알림 — `sonner`(`src/components/ui/sonner.tsx`) 사용 **(S)**

**테스트 (Playwright MCP) — 구현 후 반드시 수행**

- [ ] ↳ 테스트(정상): 할 일 선택 → 집중 시작 → `drizzle-kit studio`에서 `ended_at`이 `NULL`인 `focus_sessions` 행 생성 확인 **(M)**
- [ ] ↳ 테스트(정상): 중단 또는 종료 시 같은 행의 `ended_at`이 채워지고 `browser_snapshot`에 알림 토스트가 나타나는지 확인 **(M)**
- [ ] ↳ 테스트(영속성): 진행 중 세션이 있는 상태에서 새로고침 → 진행 중으로 복원되는지 확인 **(M)**
- [ ] ↳ 테스트(경계값·실패): 이미 진행 중인 세션이 있을 때 또 시작을 누르면 중복 행이 생기지 않고 거부되는지 확인 **(M)**
- [ ] ↳ 테스트(실패 경로): 삭제된 `task_id`로 세션을 시작하려 할 때 FK 위반이 예외가 아니라 상태 메시지로 처리되는지 확인 **(S)**
- [ ] ↳ 테스트(회귀): `browser_console_messages`로 하이드레이션 불일치(React #418) 유무 확인 — 타이머는 이 경고가 나기 가장 쉬운 구간입니다 **(S)**

### 완료 기준 (DoD)

- 할 일 하나를 선택해 집중 시작을 누르면 `focus_sessions`에 `ended_at`이 `NULL`인 행이 생긴다 (`drizzle-kit studio` 확인).
- 타이머가 끝나거나 사용자가 중단하면 같은 행의 `ended_at`이 채워지고, 화면에 알림이 뜬다.
- 진행 중인 세션이 있는 상태에서 새로고침해도 세션이 진행 중으로 복원된다.
- `npm run lint`에서 `react-hooks/purity` 위반이 0건이다.
- `npm run lint` · `npx tsc --noEmit` · `npm run build` 전부 오류 없음.
- **위 테스트 6개 항목을 Playwright MCP로 전부 수행해 통과했고, 콘솔에 하이드레이션 경고가 없다.**

### 위험 · 주의

- `react-hooks/purity`가 **error**입니다. 시간 측정은 모듈 스코프 함수(`src/lib/examples/timing.ts`의 `measuredSleep` 패턴)나 Server Action 안에서만.
- `typeof window`를 JSX에 그대로 쓰면 하이드레이션 불일치(React #418)가 납니다. `useSyncExternalStore`의 서버/클라이언트 스냅샷으로 나누세요.

---

## M5 — 주간/월간 생산성 리포트 · Should-have

**목표**: 한 주와 한 달 동안의 MIT 완료율과 몰입 시간을 한 화면에서 본다.

**선행 조건**: M4 완료 (`focus_sessions`에 데이터가 쌓인 뒤). 차트 색 토큰(§9.2)은 이 Phase에서 처음 필요합니다.

### 작업 체크리스트

- [ ] `src/app/globals.css`의 `--chart-1`~`--chart-5`를 PRD §9.2의 확정 oklch 값으로 교체 — `:root`(라이트 5색)와 `.dark`(다크 5색)를 **서로 다른 값으로** 교체. `@theme inline`의 `--color-chart-*` 매핑은 이미 존재하므로 추가 작업 없음 **(S)**
- [ ] 집계 함수 — 기간별 완료율, 몰입 시간 합계 (`src/lib/tasks.ts` / `src/lib/focus.ts`) **(L)**
- [ ] 리포트 라우트 추가 — `src/app/report/page.tsx` (Server Component) **(M)**
- [ ] 차트 라이브러리 선정 후 설치 (PRD §7.5: "착수 시점에 라이브러리만 고르면 됩니다") **(M)**
- [ ] 차트 + **값 라벨 또는 같은 데이터의 표 토글** 동시 제공 (§9.2 구현 규칙 2) **(M)**
- [ ] 헤더 nav에 리포트 링크 추가 — `src/components/layout/site-header.tsx` **(S)**

**테스트 (Playwright MCP) — 구현 후 반드시 수행**

- [ ] ↳ 테스트(집계 정확성): 지난 7일치 데이터를 `drizzle-kit studio`에서 직접 센 값과 `/report`에 표시된 완료율·몰입 시간이 일치하는지 대조 **(L)**
- [ ] ↳ 테스트(경계값): 데이터가 0건인 기간, 완료 0%인 기간, 100%인 기간에서 0으로 나누기나 `NaN`이 표시되지 않는지 확인 **(M)**
- [ ] ↳ 테스트(토큰): `/examples/theme`의 차트 색 비교표에서 `chart-1`~`chart-5`가 라이트/다크 **서로 다른 값**으로 읽히고 무채색이 아닌지 `browser_snapshot`으로 확인 **(S)**
- [ ] ↳ 테스트(접근성): 라이트 모드에서 각 계열이 색 외에 값 라벨이나 표로도 식별 가능한지 확인 **(S)**
- [ ] ↳ 테스트(링크): 헤더의 리포트 링크를 `browser_click`으로 눌러 실제로 이동하는지 확인 — `typedRoutes`가 꺼져 있어 `href` 오타는 **런타임 404**입니다 **(S)**

### 완료 기준 (DoD)

- `/examples/theme`의 차트 색 비교표에서 `chart-1`~`chart-5`가 **라이트와 다크에서 서로 다른 값**으로 읽히고, 5색 모두 무채색이 아니다.
- 한 차트에 표시되는 데이터 계열이 **3개 이하**다 (§9.2 구현 규칙 1).
- 라이트 모드에서 차트의 각 계열이 **색 외에도 값 라벨이나 표로 식별 가능**하다 (§9.2 구현 규칙 2 — aqua·yellow·magenta는 배경 대비 3:1 미만).
- 지난 7일 데이터로 계산한 완료율이 `drizzle-kit studio`에서 직접 센 값과 일치한다.
- 새 라우트 추가 후 dev/build를 한 번 돌린 뒤 `npx tsc --noEmit`이 통과한다.
- `npm run lint` · `npm run build` 오류 없음.
- **위 테스트 5개 항목을 Playwright MCP로 전부 수행해 통과했다.**

### 위험 · 주의

- 차트 색도 토큰이므로 `:root` · `.dark` 두 곳을 **모두** 고쳐야 합니다. 한쪽만 고치면 다크에서 색이 바뀌지 않고 **빌드 에러 없이 조용히 실패**합니다.
- `typedRoutes`가 꺼져 있어 `href` 오타는 타입 에러가 아니라 **런타임 404**입니다. 헤더 링크 추가 후 실제로 클릭해 확인하세요.

---

## 백로그 (Could-have)

착수 조건이 갖춰지지 않았거나 우선순위가 낮아 Phase에 넣지 않은 항목입니다. 진행하려면 별도 결정이 필요합니다.

| 항목 | 출처 | 메모 |
| :--- | :--- | :--- |
| Google Calendar 연동 | PRD §4 Could-have | 외부 OAuth가 필요합니다. "인증을 두지 않는다"(§7.2)와 "배포하지 않는다"(§7.4)와의 관계를 먼저 정리해야 합니다 |
| Slack 알림 연동 | PRD §4 Could-have | 외부 토큰·웹훅 관리 방식 미정 |
| Pretendard dynamic subset 교체 | PRD §9.3 | 로컬 전용이라 현재 파일 크기가 문제되지 않습니다. LCP가 기준을 못 맞출 때만 |

---

## 결정 필요 (로드맵 밖 사항)

PRD 안에는 미결 항목이 없습니다. 아래는 **PRD가 다루지 않아 이 로드맵이 전제로 삼은 것**이며, 다르게 가려면 알려 주세요.

| 항목 | 이 로드맵의 전제 | 근거 |
| :--- | :--- | :--- |
| 앱 메인 화면의 위치 | `/` (`src/app/page.tsx`)를 앱 화면으로 **교체**하고 스타터킷 소개 랜딩은 제거 | PRD §8.1이 `src/app/actions.ts`, §8.4가 `revalidatePath("/")`를 지정 |
| 기존 `/examples` · `/icons` 화면 | **존치**. 삭제하지 않음 | CLAUDE.md — 스택 검증 자산이며 M0의 토큰·폰트 검증 수단 |
| 유닛 테스트 러너 도입 | 도입하지 않음 | PRD §7.4 · CLAUDE.md. 도입은 범위 변경이므로 별도 결정 |
| 동작 테스트 수단 | **Playwright MCP**로 수행하며 모든 Phase의 필수 절차 | 유닛 러너가 없는 상태에서 비즈니스 로직·API 연동의 회귀를 잡을 유일한 수단. §0.4에 원칙을 정의 |

---

## 변경 이력

| 날짜 | 변경 내용 | 사유 |
| :--- | :--- | :--- |
| 2026-09-22 | 최초 작성. M0(디자인 기반) ~ M5(리포트) 6개 Phase와 백로그 정의 | `docs/기획서_결과.md` 전면 갱신(§7·§8·§9 확정)에 따라 실행 계획으로 전환 |
| 2026-09-22 | **테스트 절차를 계획에 편입.** §0.3 검증 수단의 "브라우저 수동 확인"을 **Playwright MCP**로 교체하고 §0.4 테스트 원칙(네 축 검증·도구·판정 기준) 신설. M0~M5 전 Phase에 `↳ 테스트:` 체크리스트 항목과 "Playwright MCP 전 항목 통과" DoD 추가 | 구현만 끝내고 검증 없이 넘어가는 것을 막기 위함. 특히 API 연동·비즈니스 로직(MIT 3개 제한, `mit_order` 재배치, 집계)은 틀려도 예외가 나지 않아 **실행해 보지 않으면 드러나지 않습니다.** 구현 에이전트(`nextjs-app-router`·`drizzle-data-layer`) 정의에도 같은 프로토콜을 반영 |
