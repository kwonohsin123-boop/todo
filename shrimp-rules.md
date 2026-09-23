# Development Guidelines

> **이 문서는 AI Coding Agent 전용 작업 규범입니다.** 사람용 튜토리얼이 아닙니다.
> 일반 개발 지식은 담지 않습니다. **이 저장소에서만 성립하는 사실과 금지 사항**만 담습니다.
> 여기 적힌 규칙과 실제 코드가 어긋나면 **코드가 우선**이며, 즉시 이 문서를 고치십시오.

---

## 1. 프로젝트 개요

- 제품: **오늘의 MIT** — 하루 핵심 업무 3개(MIT)를 상단 고정하고, 나머지 할 일을 타임블록에 배치해 완료율을 보는 웹앱.
- 전제: **로컬 단일 사용자.** 배포·인증·멀티테넌시·외부 백엔드가 **없습니다.**
- 스택: Next.js **16.3.5** App Router / React 19.2.8 / TypeScript strict / Tailwind **v4** / shadcn(`base-nova` 프리셋, 프리미티브는 **Base UI**) / SQLite + Drizzle ORM / `@dnd-kit/*`.
- UI 언어는 **한국어**이고, 시간 표기는 **`Asia/Seoul` 고정**입니다.

### 1.1 문서 읽는 순서 (작업 전 필수)

| 순서 | 파일 | 이 문서에서 얻을 것 |
| :--- | :--- | :--- |
| 1 | `AGENTS.md` | Next 16이 학습 데이터와 다르다는 경고. **의심되면 `node_modules/next/dist/docs/01-app/` 를 먼저 읽으라는 지시** |
| 2 | `CLAUDE.md` | 명령어 표, 스택 함정 전체 목록 |
| 3 | `docs/기획서_결과.md` | **PRD 본문(확정 사양).** §7 스택 · §8 데이터 모델 · §9 디자인 기준 |
| 4 | `docs/ROADMAP.md` | 실행 계획. M0~M5 체크리스트 · DoD · §0.4 테스트 원칙 · §1 범위 밖 |
| 5 | `docs/assets/DESIGN.md` | 시각 레퍼런스(카카오뱅크). **권한 문서가 아님** — §9.5의 제외 목록을 반드시 함께 볼 것 |

- `docs/기획서.md` 는 **PRD가 아니라 PRD를 생성한 프롬프트**입니다. 사양 근거로 인용하지 마십시오.
- `.claude/agents/*.md` 6개는 역할별 서브에이전트 정의입니다. 역할 경계를 바꾸려면 그 파일을 고치십시오.

### 1.2 현재 진척 (코드 실측 기준 — 2026-09-23)

| 구간 | 상태 | 근거 파일 |
| :--- | :--- | :--- |
| M0 디자인 토큰·Pretendard·radius·chart 5색·`--text-title` | **구현·테스트 모두 통과 (2026-09-23)** | `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`. 로드맵 M0 체크박스 13개 전부 체크됨 |
| M1-A 스키마·마이그레이션·DB 클라이언트 | **완료** | `src/db/schema.ts`, `src/db/client.ts`, `drizzle/0000_concerned_the_enforcers.sql`, `data/todo.db` |
| M1-B 데이터 계층 | **부분** | `src/lib/tasks.ts` (`todayKey` · `isDone` · `listTasksByDate` 만 존재. 완료율 계산 함수 없음) |
| M1-C Server Action | **없음** | `src/app/actions.ts` **미생성** |
| M1-D 앱 화면 | **없음** | `src/app/page.tsx` 는 TODO 주석만 있는 빈 셸 |

→ 다음 작업은 **M1 C부터**입니다. 다른 곳부터 손대지 마십시오.

> **§8.2 결정 트리("선행 Phase의 `↳ 테스트` 항목이 남아 있으면 다음 Phase로 넘어가지 마십시오")와의 관계.** M0는 구현만 끝나고 테스트가 미수행인 상태였으므로 이 표의 "M1 C부터"와 충돌하고 있었습니다. **2026-09-23에 M0 테스트 5개를 프로덕션 빌드 위에서 Playwright MCP로 수행해 전부 통과**시켜 충돌이 해소되었습니다. 이제 M1 착수가 결정 트리상 허용됩니다.

---

## 2. 프로젝트 아키텍처

### 2.1 디렉터리별 배치 규칙

| 경로 | 여기에 두는 것 | 여기에 **두지 않는 것** |
| :--- | :--- | :--- |
| `src/app/` | 라우트·레이아웃·페이지. **`page.tsx`는 전부 Server Component** | `"use client"` 페이지, 재사용 컴포넌트 |
| `src/app/actions.ts` | `'use server'` — **async 함수만** | 타입·상수·동기 헬퍼(빌드 실패) |
| `src/app/api/` | Route Handler 4개(검증 자산) | 앱 도메인용 신규 엔드포인트(먼저 Server Action을 검토) |
| `src/app/examples/` | 스택 검증 화면 9개 | 도메인 기능 |
| `src/components/ui/` | **shadcn CLI 생성물 전용** | 손으로 만든 새 파일 |
| `src/components/layout/` | `site-header.tsx` · `site-footer.tsx` | |
| `src/components/demo/` | 검증 화면 전용 측정 컴포넌트 | 앱 화면이 쓰는 컴포넌트 |
| `src/db/schema.ts` | Drizzle 테이블 정의 + `$inferSelect`/`$inferInsert` 타입 | 쿼리 함수 |
| `src/db/client.ts` | `better-sqlite3` 연결 + `globalThis` 싱글턴 | 쿼리 함수 |
| `src/lib/tasks.ts` | 조회·변환 함수, **폼 상태 타입·초기값·도메인 상수** | DB 연결 생성 |
| `src/lib/examples/` | 검증 화면용 데이터·유틸 | 앱 도메인 로직 |
| `src/lib/utils.ts` | `export { cn } from "cn"` 한 줄(**shadcn CLI alias 타깃 전용**) | 새 유틸 함수 |
| `src/fonts/` | `PretendardVariable.woff2` (**커밋 대상**) | |
| `drizzle/` | 생성된 마이그레이션 SQL + `meta/` (**커밋 대상**) | 손으로 만든 SQL(생성 후 보정은 허용) |
| `data/` | `todo.db` (**`.gitignore` 대상**, `.gitkeep`만 커밋) | |
| `docs/` | PRD·ROADMAP·DESIGN | 코드 |

### 2.2 3계층 처리 방식 (별도 백엔드 없음)

| 역할 | 수단 | 참고 구현 |
| :--- | :--- | :--- |
| 읽기 | Server Component → `src/lib/tasks.ts` → DB 직행 | `src/app/examples/posts/page.tsx` |
| 쓰기 | Server Action + `useActionState` + `revalidatePath` | `src/app/examples/server-actions/actions.ts` ↔ `src/lib/examples/guestbook.ts` |
| JSON 엔드포인트 | Route Handler | `src/app/api/posts/route.ts` |

- **클라이언트에서 `fetch`로 자기 데이터를 읽지 마십시오.** 읽기는 Server Component가 DB에 직행합니다.

---

## 3. 코드 표준

### 3.1 포매팅 (실측 규약 — `src/` 의 TS/TSX 77개 전부가 이 스타일)

- **세미콜론을 쓰지 않습니다.** 단, 루트 설정 파일(`next.config.ts` · `postcss.config.mjs` · `eslint.config.mjs`)은 create-next-app 원본이므로 **현 상태를 유지**합니다.
- 문자열은 **큰따옴표**. 들여쓰기 **2칸**.
- import 순서: 외부 패키지 → 빈 줄 → `@/` 별칭. 경로 별칭은 `@/*` → `./src/*` 하나뿐입니다.
- 상대 경로 import는 같은 폴더 안(`./schema`)에서만 씁니다. 폴더를 넘으면 `@/`를 쓰십시오.

```ts
// ✅ 올바른 예 (src/db/client.ts 실제 형태)
import { mkdirSync } from "node:fs"
import path from "node:path"

import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"

import * as schema from "./schema"

// ❌ 금지: 세미콜론 + 작은따옴표 + 그룹 미분리
import {mkdirSync} from 'node:fs';
import {db} from '../../db/client';
```

### 3.2 네이밍

| 대상 | 규칙 | 예 |
| :--- | :--- | :--- |
| 파일명 | kebab-case | `site-header.tsx` · `guestbook-form.tsx` |
| 컴포넌트 | PascalCase, **함수 선언**(`export function X()`) | `export function SiteHeader()` |
| 변수·함수 | camelCase, **영어** | `listTasksByDate` · `todayKey` |
| 상수 | UPPER_SNAKE + `as const` | `MIT_SLOTS` · `DEFAULT_DURATION_MIN` |
| DB 컬럼 | snake_case를 **SQL 문자열로 명시** | `text("planned_date")` |
| 타입 | PascalCase, `type` 별칭 선호 | `TaskFormState` · `MitSlot` |

- **`drizzle.config.ts`에 `casing`을 추가하지 마십시오.** `schema.ts`가 컬럼명을 전부 명시하는 것이 이 저장소의 방식입니다.
- 컴포넌트를 `const X = () => {}` 형태로 선언하지 마십시오.

### 3.3 주석

- **주석은 한국어로 작성합니다.**
- "무엇을 하는가"가 아니라 **"왜 이렇게 해야 하는가 / 안 하면 무엇이 조용히 깨지는가"** 를 적습니다.
- 함정을 우회한 코드에는 근거(PRD 절 번호 또는 파일 경로)를 남깁니다.

```ts
// ✅ 이 저장소의 주석 스타일
// WAL: 읽기와 쓰기가 서로를 막지 않습니다. .db-wal / .db-shm 파일이 함께 생깁니다.
sqlite.pragma("journal_mode = WAL")

// ❌ 금지: 코드를 그대로 반복하는 주석
// journal_mode를 WAL로 설정한다
```

- 미완 지점은 담당 에이전트를 지목해 표기합니다: `// TODO(nextjs-app-router): ...` (`src/app/page.tsx` 참고).

---

## 4. 기능 구현 규범

### 4.1 Server Action 계약 (위반 시 빌드 실패 또는 무음 버그)

1. `src/app/actions.ts` 는 첫 줄이 `"use server"` 이고 **모든 export가 async 함수**여야 합니다.
2. 액션 시그니처는 `(prevState, formData)` 이고, `useActionState(action, initial)` 의 반환값은 **`[state, formAction, isPending]` 세 개**입니다.
3. **예외를 throw하지 않습니다.** 검증 실패도 상태 객체로 반환합니다.
4. 쓰기 성공 후 `revalidatePath("/")` 를 호출합니다.
5. 액션 안에서 **도메인 제약을 서버측에서 다시 검증**합니다. Server Function은 UI를 거치지 않은 직접 POST로도 도달합니다.

```ts
// ✅ src/app/actions.ts
"use server"

import { revalidatePath } from "next/cache"

import { type TaskFormState } from "@/lib/tasks"

export async function createTask(
  prevState: TaskFormState,
  formData: FormData
): Promise<TaskFormState> { /* ... */ }

// ❌ 같은 파일에서 절대 금지 — 빌드가 깨집니다
export type TaskFormState = { /* ... */ }        // 타입 export 금지
export const initialTaskFormState = { /* ... */ } // 상수 export 금지
export function isDone(t: Task) { /* ... */ }     // 동기 함수 export 금지
```

→ 타입·상수·동기 헬퍼는 **`src/lib/tasks.ts`** 에 둡니다. `TaskFormState` · `initialTaskFormState` · `MIT_SLOTS` · `DEFAULT_DURATION_MIN` 이 이미 그곳에 있습니다.

### 4.2 도메인 불변식 (틀려도 에러가 나지 않으므로 반드시 검증)

| 불변식 | 구현 위치 | 검증 방법 |
| :--- | :--- | :--- |
| MIT는 `mit_order` **0·1·2 세 개뿐** | DB: `UNIQUE(planned_date, mit_order)` + `CHECK` (`schema.ts`) **+** Server Action 재검증 | 4번째 지정 시도가 **거부되고 사유가 화면에 보이며 행이 남지 않아야** 함 |
| 완료 상태는 **`done_at`의 NULL 여부** | `src/lib/tasks.ts`의 `isDone()` | `npm run db:studio` 로 `done_at` 값/NULL 전환 확인 |
| epoch ms 컬럼은 **`mode: "timestamp_ms"`** | `schema.ts` | `mode: "timestamp"` 는 초 단위라 **1000배 어긋남** |
| 날짜 키는 `YYYY-MM-DD`, `en-CA` + `Asia/Seoul` | `todayKey()` (`src/lib/tasks.ts`) | 직접 `toISOString().slice(0,10)` 으로 만들지 말 것 |
| 화면 시간 표기는 `ko-KR` + `Asia/Seoul` 고정 | `formatServerTime()` (`src/lib/examples/timing.ts`) 방식 | 고정하지 않으면 하이드레이션 불일치 |

- **완료 여부용 boolean 컬럼을 새로 만들지 마십시오.**
- `focus_sessions` 테이블은 **M4 착수 시점에** 새 마이그레이션으로 추가합니다. 지금 만들지 마십시오.

### 4.3 Server / Client 경계

- `page.tsx` 는 **전부 Server Component**로 유지합니다.
- 아래 중 하나라도 필요하면 **그 조각만 별도 파일로 분리**하고 그 파일 첫 줄에 `"use client"` 를 씁니다.
  - `onClick` 등 이벤트 핸들러 / `useState`·`useActionState` 등 훅 / 브라우저 API / `@dnd-kit/*` / `error.tsx`
- `Button`·`Badge` 에 `onClick` 을 달면 **그 파일은 클라이언트여야 합니다.**
- 참고 구현: `src/app/examples/server-actions/guestbook-form.tsx`, `src/app/examples/error-handling/boom-button.tsx`.

```tsx
// ✅ page.tsx(서버)에서 클라이언트 조각을 조립
import { TaskForm } from "./task-form"   // "use client" 파일
export default function Home() {
  return <TaskForm />
}

// ❌ page.tsx 상단에 "use client" 를 붙여 페이지 전체를 클라이언트로 만들기
```

- `typeof window` 를 JSX에 직접 쓰지 마십시오. `useSyncExternalStore` 의 서버/클라이언트 스냅샷으로 나눕니다(`src/components/demo/examples/client-stamp.tsx` 참고).

### 4.4 시간·랜덤 호출 위치

- `Date.now()` · `new Date()` · `performance.now()` · `Math.random()` 을 **컴포넌트 본문에서 호출하지 마십시오.** ESLint `react-hooks/purity` 가 **error**로 막습니다.
- 허용 위치: 모듈 스코프 함수, Server Action 본문, `page.tsx`의 async 본문 중 서버 경계.
- `todayKey()` 는 인자를 생략하면 내부에서 `new Date()` 를 호출합니다. **컴포넌트 본문에서 부르지 마십시오.**

---

## 5. 프레임워크 · 라이브러리 사용 규범

### 5.1 shadcn 프리미티브는 Base UI입니다 (Radix 아님)

웹에서 찾은 shadcn 예제는 대부분 Radix 기준이라 **그대로 쓰면 동작하지 않습니다.** 아래 세 가지 신호가 보이면 Radix 예제이므로 변환하십시오.

| 항목 | ✅ 이 저장소 (Base UI) | ❌ 흔한 Radix 예제 |
| :--- | :--- | :--- |
| 트리거 합성 | `render={<Button variant="outline" />}` | `asChild` + 자식 엘리먼트 |
| Props 타입 | `DialogPrimitive.Popup.Props` | `React.ComponentProps<typeof X>` |
| 열림 상태 | `data-open` / `data-closed` | `data-state="open"` |

- 근거: `src/components/mode-toggle.tsx:20`, `src/components/ui/dialog.tsx:47,63`, `src/components/ui/accordion.tsx`.
- 모든 프리미티브는 `data-slot` 속성을 갖습니다. 새로 합성할 때도 유지하십시오.

### 5.2 클래스 병합은 `cn` 패키지

```ts
import { cn } from "cn"        // ✅ src/ 전체가 이 형태
import { cn } from "@/lib/utils" // ❌ 실제로 이렇게 쓰는 파일이 하나도 없습니다
import clsx from "clsx"          // ❌ 설치되어 있지 않습니다
import { twMerge } from "tailwind-merge" // ❌ 설치되어 있지 않습니다
```

### 5.3 Tailwind v4 — 설정 파일이 없습니다

- **`tailwind.config.*` 를 만들지 마십시오.** 테마는 `src/app/globals.css` 한 곳입니다.
- 색 토큰 하나를 추가·변경하려면 **세 군데를 함께** 고칩니다. 하나라도 빠지면 **빌드 에러 없이 조용히 실패**합니다.

```css
/* 1. 라이트 값 */ :root { --my-color: oklch(...); }
/* 2. 다크 값   */ .dark { --my-color: oklch(...); }
/* 3. 유틸 생성 */ @theme inline { --color-my-color: var(--my-color); }
```

- 3번이 빠지면 `bg-my-color` **클래스 자체가 생성되지 않습니다.** 2번이 빠지면 다크에서 색이 바뀌지 않습니다.
- 다크 모드는 다섯 조각이 모두 맞아야 동작합니다: `globals.css:5`의 `@custom-variant dark` · `:root` 토큰 · `.dark` 토큰 · `@theme inline` 연결 · `layout.tsx`의 `<ThemeProvider attribute="class">` 와 `<html suppressHydrationWarning>`.
- **`text-destructive-foreground` 를 쓰지 마십시오.** `--destructive-foreground` 토큰이 없어 클래스가 생성되지 않고 조용히 무시됩니다. → `text-white` 를 쓰십시오.
- 앱 화면(`src/app/` 이하)에서 **`shadow-*` 를 쓰지 마십시오**(PRD §9.4). 단, `dropdown-menu`·`popover`·`select`·`tabs` 4개 CLI 생성 파일의 기본 그림자는 **건드리지 마십시오.**
- **페이지 타이틀(PRD §9.3의 32px/700)은 `text-title` 입니다.** Tailwind v4 기본 스텝에 32px가 없어 `globals.css:34-35` 의 `@theme inline` 에 `--text-title` + line-height 짝을 확정해 뒀습니다. `text-3xl`(30px) 이나 임의값 `text-[2rem]` 을 쓰지 마십시오. 24/16/14px 은 새 토큰 없이 `text-2xl`·`text-base`·`text-sm` 을 씁니다. 크기 토큰이므로 `:root`/`.dark` 에는 넣지 않습니다(위의 "세 곳 함께"는 색 토큰 규칙). `/examples`·`/icons` 의 h1 은 판정 기준선이므로 **바꾸지 마십시오.**

### 5.4 컴포넌트 추가

- `src/components/ui/` 에 **손으로 새 파일을 만들지 마십시오.** `npx shadcn@latest add <name>` 으로 생성한 뒤 수정합니다.
- **항상 `--dry-run` 을 먼저 실행**해 기존 파일 덮어쓰기를 확인합니다.
- **`field` 는 추가하지 마십시오.** `registryDependencies` 가 `label`·`separator` 라 기존 두 파일을 덮어씁니다.
- `alert` 를 재생성하면 `src/components/ui/alert.tsx` 의 grid 트랙 수기 패치(`minmax(0,1fr)`)가 **되돌아갑니다.** 재생성했다면 즉시 복원하십시오. 복원하지 않으면 `Alert` 안에 코드 블록이나 긴 URL이 들어갈 때 **페이지 전체에 가로 스크롤**이 생깁니다.
- 프리미티브를 Radix로 교체하려면 `src/components/ui/` 전체 재생성이 필요합니다(`README.md` §7.2). 임의로 시작하지 마십시오.

### 5.5 Drizzle + SQLite

- 스키마 세 번째 인자는 **배열을 반환하는 콜백**입니다. 객체 반환형은 deprecated 입니다.
- 마이그레이션 절차: `src/db/schema.ts` 수정 → `npm run db:generate` → **생성된 SQL을 열어 `UNIQUE`·`CHECK`가 실제로 들어갔는지 확인** → `npm run db:migrate` → `npm run db:studio` 로 행 확인.
- `drizzle/` 의 SQL과 `meta/` 는 **함께 커밋**합니다. `data/todo.db` 는 커밋하지 않습니다.
- `src/db/client.ts` 의 `globalThis` 싱글턴을 제거하지 마십시오. `next dev` HMR이 매번 새 연결을 열어 파일 락·`SQLITE_BUSY` 가 납니다.
- `better-sqlite3` 는 Next 16이 기본으로 번들 제외하므로 **`next.config.ts` 에 `serverExternalPackages` 를 추가하지 마십시오.**

### 5.6 Next.js 16

- Turbopack이 기본입니다. **`--turbopack` 플래그를 추가하지 마십시오.**
- `next lint` 는 제거되었습니다. 린트는 `npm run lint`(= `eslint`) 로만 돌립니다. **`next build` 는 린트를 실행하지 않습니다.**
- `LayoutProps<"/">` · `PageProps<"/path">` 는 **import 없이 쓰는 전역 타입**입니다(`src/app/layout.tsx:30`). 새 라우트 추가 후에는 **dev 또는 build를 한 번 돌린 뒤** 타입 체크하십시오.
- `revalidateTag(tag, profile)` 는 **인자가 두 개**입니다.
- `<Image priority>` 는 deprecated 입니다. → `preload` 를 쓰십시오.
- `next/image` 의 `width`/`height` 는 **원본 종횡비와 정확히 같아야** 합니다(`public/next.svg` 는 `394×80`). 표시 크기는 CSS로 줄이십시오.
- `images.qualities` 는 allowlist이며 `next.config.ts` 에 `[20, 50, 75, 90]` 만 등록되어 있습니다. 목록 밖 값은 프로덕션에서 **조용히 75**로 처리됩니다.
- `dynamic = "force-static"` Route Handler의 `GET` 은 **인자를 받을 수 없습니다**(`request` 를 쓰면 빌드 실패). 대조군: `src/app/api/time/route.ts` ↔ `src/app/api/cached-time/route.ts`.
- API가 조금이라도 의심스러우면 **추측하지 말고 `node_modules/next/dist/docs/01-app/` 의 해당 가이드를 먼저 읽으십시오**(`AGENTS.md` 지시).

### 5.7 ESLint React Compiler 규칙 (전부 error)

| 규칙 | 걸리는 코드 | 회피 |
| :--- | :--- | :--- |
| `react-hooks/purity` | 컴포넌트 본문의 `Date.now()` · `new Date()` · `performance.now()` | 모듈 스코프 함수로 분리(`measuredSleep` · `todayKey(now)`) |
| `react-hooks/refs` | 렌더 중 `ref.current` 읽기·쓰기 | 렌더 카운터 패턴 사용 금지 |
| `react-hooks/set-state-in-effect` | 이펙트 본문의 무조건 `setState` | `useSyncExternalStore`, 또는 DOM 측정처럼 조건부로만 |

### 5.8 `@dnd-kit/*` (M2에서 사용)

- 설치본: `@dnd-kit/core` 6.3.1 · `sortable` 10 · `modifiers` 9 · `utilities` 3.
- **클라이언트 전용**입니다. 타임라인·MIT 목록 컴포넌트는 `"use client"` 파일이어야 하고, 감싸는 `page.tsx` 는 Server Component로 둡니다.
- **HTML5 네이티브 `draggable` 을 쓰지 마십시오.** 키보드 조작 경로가 없어 PRD §6의 단축키 중심 UX 요구와 충돌합니다. `KeyboardSensor` 를 반드시 붙이십시오.
- `@dnd-kit/react`(0.x 프리릴리스)로 갈아타지 마십시오.

### 5.9 차트 (M5에서 사용)

- 색은 `--chart-1` ~ `--chart-5` 를 쓰고, 값을 바꾸지 마십시오(PRD §9.2에서 검증 완료).
- **한 차트의 계열은 3개까지**입니다. 4번째부터 색각 검증을 통과하지 못합니다.
- **라이트 모드 차트에는 직접 라벨 또는 표 보기를 반드시 함께** 제공합니다(3색이 배경 대비 3:1 미만).

---

## 6. 워크플로 규범

### 6.1 검증 파이프라인 (순서 고정)

```
npm run check-all   ==   npm run lint  →  npm run build  →  npm run typecheck
```

- **순서를 바꾸지 마십시오.** `tsc --noEmit` 이 참조하는 `LayoutProps`·`PageProps` 는 `next build` 가 생성하는 `.next/types` 에 있습니다. build 앞에서 typecheck를 돌리면 갓 클론한 트리에서 **실재하지 않는 타입 에러**가 납니다. lint가 맨 앞인 것은 가장 싼 검사로 먼저 실패시키기 위함입니다.
- 새 라우트·페이지를 추가한 경우도 이 파이프라인 하나로 해결됩니다. **dev를 먼저 띄울 필요가 없습니다.**
- **테스트 프레임워크가 설치되어 있지 않습니다.** 없는 `npm test` · `npm run test:e2e` 같은 명령을 **지어내지 마십시오.** `check-all` 은 테스트 러너가 아니라 lint·build·typecheck 묶음입니다.
- **Jest·Vitest 등 유닛 테스트 러너를 도입하지 마십시오.** 범위 변경이며 별도 결정이 필요합니다(ROADMAP §1).
- 동작 확인까지 포함한 완료 판정은 `CLAUDE.md` 의 `## 작업 완료 체크리스트` 를 따릅니다(2단계 → §6.3 · §6.4, 3단계 → §6.3, 4단계 → §6.2).

### 6.2 프로덕션 빌드에서만 확인 가능한 것

`npm run build && npm run start` 위에서만 판정합니다. **`next dev` 는 매 요청 재렌더하므로 차이가 드러나지 않습니다.**

- `revalidatePath` 의 효과 / `dynamic = "force-static"` / 프리렌더된 페이지의 '서버 렌더 시각' / LCP 측정

### 6.3 동작 테스트는 Playwright MCP로 수행합니다

- **구현만 끝난 작업은 완료가 아닙니다.** 로드맵의 `↳ 테스트:` 항목이 남아 있으면 그 작업은 끝나지 않은 것입니다.
- 판정 근거는 `browser_snapshot` 의 **텍스트·role** 또는 네트워크 응답입니다. **스크린샷의 인상이나 "눈으로 확인"은 근거로 인정하지 않습니다.**

| 도구 | 용도 |
| :--- | :--- |
| `browser_navigate` | 대상 경로 열기 |
| `browser_snapshot` | **판정 기준** |
| `browser_click` · `browser_type` · `browser_fill_form` | 폼 제출 · Server Action 호출 |
| `browser_press_key` | 단축키 · 키보드 전용 경로 |
| `browser_network_request` | Route Handler 직접 호출 |
| `browser_console_messages` | 콘솔 회귀 확인 |

**비즈니스 로직·데이터 쓰기는 네 축을 전부 검증합니다** (정상 경로 하나로 통과시키지 마십시오).

| 축 | 확인 내용 |
| :--- | :--- |
| 정상 | 대표 입력 1건이 기대 결과를 만든다 |
| 경계값 | MIT 2개/3개/4개, 빈 값, 최대 길이, `start_min` 0과 음수 |
| 실패 | 제약 위반이 **거부되고 사유가 화면에 보인다**(throw 아님, 상태 객체 반환) |
| 영속성 | 새로고침 후 유지되고, **거부된 시도는 행을 남기지 않는다** — `npm run db:studio` 로 대조 |

### 6.4 콘솔 회귀 기준

- 허용되는 콘솔 오류는 **아래 2건뿐**입니다. 그 외에 무언가 있으면 회귀입니다.
  1. `/examples/components` 의 Avatar 404 — 의도된 `Fallback` 전환 데모.
  2. `/examples/error-handling` 의 `Failed to load resource: 404` @ `/examples/posts/없는-글?_rsc=…` — `src/app/examples/error-handling/page.tsx:104` 의 링크를 Next `<Link>` 기본 프리페치가 당겨오면서 나는 404입니다. **2026-09-23 프로덕션 빌드 순회에서 처음 확인**되었고(dev에서는 `notFound()` 노이즈에 묻혀 있었음) 의도된 데모의 부수효과입니다. `/examples` 는 판정 도구이므로 `prefetch={false}` 로 **고치지 마십시오.**
- `notFound()` 가 dev에서 남기는 "Encountered a script tag while rendering React component" 는 **Next.js 자체 문제이며 쫓지 마십시오.** 프로덕션 빌드에서는 나오지 않습니다.
- `type="password"` 입력은 **`<form>` 안에 두고 `autoComplete` 을 주십시오.** 둘 중 하나가 빠지면 Chrome이 콘솔 힌트를 남깁니다.

### 6.5 커밋

- 커밋 메시지는 **한국어**로 작성합니다(예: `feat: 오늘의 MIT 지정·해제 서버 액션 추가`).
- `data/todo.db` · `.claude/settings.local.json` · `shrimp-data/` · `.playwright-mcp/` 는 커밋하지 마십시오(`.gitignore` 등재).
- `AGENTS.md` 는 `next dev` 가 자동으로 다시 씁니다. 디프에서 빼도 다시 생기므로 **작업과 함께 커밋**하십시오.

---

## 7. 핵심 파일 상호작용 규범

**아래 트리거가 발생하면 같은 행의 파일을 전부 함께 고치십시오.** 하나라도 빠뜨리면 조용히 실패합니다.

| # | 트리거 | 반드시 함께 수정·실행 | 검증 |
| :--- | :--- | :--- | :--- |
| 1 | 색·반경 토큰 추가/변경 | `globals.css` 의 `:root` **+** `.dark` **+** `@theme inline` | `/examples/theme` computed 값 비교표 |
| 2 | 폰트 배선 변경 | `src/app/layout.tsx` **+** `globals.css` 의 `@theme inline`(`--font-sans` / `--font-mono`) | `/examples/assets` 실제 적용 family |
| 3 | DB 스키마 변경 | `src/db/schema.ts` → `npm run db:generate` → `drizzle/*.sql` + `drizzle/meta/*` → `npm run db:migrate` → `src/lib/tasks.ts` 의 타입 사용처 | 생성 SQL 육안 확인 + `npm run db:studio` |
| 4 | Server Action 추가·변경 | `src/app/actions.ts`(async만) **+** `src/lib/tasks.ts`(타입·상수) **+** 호출하는 `"use client"` 폼 파일 | 프로덕션 빌드에서 `revalidatePath` 동작 |
| 5 | 검증 화면 추가 | `src/app/examples/<slug>/page.tsx` **+** `src/lib/examples/examples-nav.ts` | `href` 를 폴더명과 문자 단위 대조(오타는 **런타임 404**) |
| 6 | `npx shadcn add alert` 실행 | `src/components/ui/alert.tsx` 의 `minmax(0,1fr)` 패치 **복원** | `Alert` 안에 긴 URL을 넣고 가로 스크롤 없음 확인 |
| 7 | 의존성 추가 | `package.json` **+** PRD §7.5 대조 | 범위 밖이면 **PRD 개정이 먼저** |
| 8 | 로드맵 작업 완료 | `docs/ROADMAP.md` 해당 체크박스 **+** 범위가 바뀌었다면 §변경 이력 | |
| 9 | 새 라우트·페이지 추가 | `npm run check-all` (build가 `.next/types` 를 먼저 생성) | `PageProps`/`LayoutProps` 전역 타입 갱신 |
| 10 | 서브에이전트 역할 변경 | `.claude/agents/<name>.md` | |

> `grep -rl '"use client"' src/` 는 실제 개수보다 많이 잡힙니다. 검증 화면 본문이 지시문을 **문자열로 설명**하기 때문입니다. **파일 첫 줄로 확인**하십시오.

---

## 8. AI 의사결정 규범

### 8.1 우선순위 (충돌 시 위쪽이 이깁니다)

1. 사용자의 직접 지시
2. **저장소의 실제 코드**(문서보다 코드가 우선)
3. `docs/기획서_결과.md`(PRD) → `docs/ROADMAP.md`
4. `CLAUDE.md` / `AGENTS.md` / 이 문서
5. `docs/assets/DESIGN.md`(레퍼런스 영감)

### 8.2 결정 트리

**타입·상수를 어디에 둘까?**
→ 대상 파일 첫 줄이 `'use server'` 인가? → **예: 절대 두지 말고 `src/lib/tasks.ts` 에** / 아니오: 해당 모듈에 그대로.

**이 컴포넌트에 `"use client"` 가 필요한가?**
→ 이벤트 핸들러·훅·브라우저 API·dnd-kit 중 하나라도 필요한가? → **예: 그 조각만 새 파일로 분리** / 아니오: Server Component 유지.

**웹에서 찾은 shadcn 예제를 쓰려는가?**
→ `asChild` · `data-state="open"` · `React.ComponentProps<typeof X>` 중 하나가 보이는가? → **예: Radix 예제이므로 §5.1 표대로 변환** / 아니오: 그래도 `data-slot` 유지 여부를 확인.

**Next.js API 동작이 확실한가?**
→ 조금이라도 불확실하면 **`node_modules/next/dist/docs/01-app/` 을 먼저 읽습니다.** 학습 데이터 기억으로 쓰지 마십시오.

**색을 하나 쓰려는데 토큰이 있는가?**
→ `globals.css` 에서 확인 → 없으면 §5.3의 세 곳을 함께 추가. **없는 클래스를 그냥 쓰면 조용히 무시됩니다.**

**요청이 PRD 범위 밖 같은가?**
→ `docs/ROADMAP.md` §1 "범위 밖" 표를 확인 → 해당되면 **구현하지 말고 PRD 개정이 필요하다고 보고**하십시오.

**지금 무슨 작업을 해야 하는가?**
→ `docs/ROADMAP.md` 의 현재 Phase 체크리스트 + §1.2 진척 표. 선행 Phase의 `↳ 테스트:` 항목이 남아 있으면 **다음 Phase로 넘어가지 마십시오.**

**모호한 지시를 받았을 때**
→ 먼저 코드와 `docs/ROADMAP.md` 를 읽어 추론하고, 추론 결과와 근거를 제시한 뒤 진행하십시오. 분석 없이 되묻지 마십시오.

### 8.3 미확인 사실 처리

- 추측한 값을 그럴듯한 기본값으로 채우지 마십시오. **확인하거나, 확인 불가라고 명시**하십시오.
- 파일 경로·API 시그니처·패키지 버전은 인용 전에 실제로 열어 확인하십시오.

---

## 9. 금지 사항

### 9.1 파일·설정

- ❌ `tailwind.config.*` 생성
- ❌ `src/components/ui/` 에 수기 파일 생성
- ❌ `npx shadcn@latest add field` 실행
- ❌ `--dry-run` 없이 기존 이름과 겹치는 컴포넌트 추가
- ❌ `next.config.ts` 에 `serverExternalPackages` 추가
- ❌ `drizzle.config.ts` 에 `casing` 추가
- ❌ `data/todo.db` 커밋
- ❌ **`src/app/examples/` 9개 화면과 `src/app/api/` 4개 Route Handler 삭제** (스택 회귀 감지 자산)
- ❌ `src/lib/utils.ts` 에 새 유틸 추가(shadcn CLI alias 타깃 전용)

### 9.2 코드

- ❌ `import { cn } from "@/lib/utils"` / `clsx` / `tailwind-merge`
- ❌ `'use server'` 파일에서 타입·상수·동기 함수 export
- ❌ 컴포넌트 본문의 `Date.now()` · `new Date()` · `Math.random()`
- ❌ `asChild` · `data-state="open"` · `React.ComponentProps<typeof X>`
- ❌ `text-destructive-foreground`
- ❌ 앱 화면(`src/app/` 이하)의 `shadow-*`
- ❌ `--turbopack` 플래그
- ❌ `<Image priority>` (→ `preload`)
- ❌ `revalidateTag(tag)` 1인자 호출
- ❌ `force-static` Route Handler의 `GET(request)` 
- ❌ JSX에 `typeof window` 직접 사용
- ❌ 완료 여부용 boolean 컬럼 추가
- ❌ 클라이언트에서 자기 데이터를 `fetch` 로 읽기
- ❌ HTML5 네이티브 `draggable` 기반 DnD

### 9.3 범위 (요청이 들어오면 PRD 개정이 먼저입니다)

- ❌ 로그인 · 세션 · `users` 테이블 · 권한 관리
- ❌ Supabase · Express 등 별도 백엔드
- ❌ 배포 · 호스팅 · CI/CD · 도메인 · 환경변수 관리
- ❌ 다중 팀원 칸반보드
- ❌ Jest · Vitest 등 유닛 테스트 러너 도입
- ❌ KakaoBank Yellow `#FFE300` 등 브랜드 자산 차용
- ❌ 90px 히어로 타입 스케일, 금융 전용 컴포넌트(계좌 카드 · 이체 입력 · 바텀시트)
- ❌ 보조 텍스트에 `#888888` 사용(대비 3.54:1, WCAG AA 미달 → `#444444`)

### 9.4 검증

- ❌ 존재하지 않는 테스트 명령 실행·문서화
- ❌ `next dev` 에서 캐시 · `revalidatePath` · LCP 판정
- ❌ 스크린샷 인상만으로 동작 테스트 통과 처리
- ❌ 쓰기 동작을 DB 행 확인 없이 통과 처리
- ❌ 정상 경로 하나만 보고 비즈니스 로직 통과 처리
