import type { LucideIcon } from "lucide-react"
import {
  ComponentIcon,
  GaugeIcon,
  LayersIcon,
  PaletteIcon,
  RouteIcon,
  SendIcon,
  ServerIcon,
  SplitIcon,
  TriangleAlertIcon,
  TypeIcon,
} from "lucide-react"

export type ExampleEntry = {
  href: string
  title: string
  summary: string
  icon: LucideIcon
  /** 이 화면이 실제로 검증하는 항목들 */
  checks: string[]
  group: "ui" | "server"
}

/**
 * 인덱스 화면이 이 배열만 렌더합니다.
 * typedRoutes가 꺼져 있어 href 오타는 타입 에러가 아니라 런타임 404가 되므로,
 * 항목을 추가할 때 src/app/examples/ 아래 폴더 이름과 반드시 대조하세요.
 */
export const exampleEntries: ExampleEntry[] = [
  {
    href: "/examples/theme",
    title: "테마와 다크 모드",
    summary:
      "globals.css의 색 토큰이 라이트와 다크에서 실제로 다른 값인지 실측해 보여줍니다.",
    icon: PaletteIcon,
    checks: [
      "색 토큰 31개 팔레트와 computed 값 실측",
      "라이트와 다크 값을 한 화면에서 동시 비교",
      "radius 스케일 sm부터 4xl까지",
      "shimmer · scroll-fade · no-scrollbar 숨은 유틸리티",
    ],
    group: "ui",
  },
  {
    href: "/examples/components",
    title: "UI 프리미티브",
    summary:
      "설치된 shadcn 컴포넌트를 variant와 size 조합까지 전부 렌더하고 Base UI 특유의 합성 API를 확인합니다.",
    icon: ComponentIcon,
    checks: [
      "Button variant 6종 × size 8종 전체 매트릭스",
      "render prop 합성과 data-* 상태 라이브 출력",
      "오버레이 · 폼 · 디스클로저 프리미티브",
      "키보드 조작 체크리스트",
    ],
    group: "ui",
  },
  {
    href: "/examples/assets",
    title: "폰트 · 아이콘 · 이미지",
    summary:
      "Pretendard 변수 배선이 실제로 적용됐는지 computed 값으로 확인하고 next/image 최적화 경로를 검증합니다.",
    icon: TypeIcon,
    checks: [
      "font-sans · font-mono · font-heading 실제 적용 family",
      "lucide 크기 · 색 상속 · 컨테이너 자동 규칙",
      "next/image srcset과 currentSrc 실측",
      "SVG가 최적화를 우회하는 이유",
    ],
    group: "ui",
  },
  {
    href: "/examples/server-actions",
    title: "Server Action",
    summary:
      "useActionState로 서버 유효성 검사 결과를 받고 revalidatePath로 서버 컴포넌트를 갱신합니다.",
    icon: SendIcon,
    checks: [
      "form action에 Server Function 직접 연결",
      "prevState와 pending 상태 전달",
      "서버측 유효성 검사와 aria-invalid",
      "revalidatePath 후 서버 렌더 시각 갱신",
    ],
    group: "server",
  },
  {
    href: "/examples/route-handlers",
    title: "Route Handler와 캐싱",
    summary:
      "자체 /api 엔드포인트를 호출해 status와 소요 시간을 보고, 캐시 기본값과 opt-in을 대조합니다.",
    icon: ServerIcon,
    checks: [
      "GET · POST 시그니처와 NextRequest",
      "Next 16의 캐시 기본값(캐시 안 됨)",
      "force-static으로 캐시 opt-in",
      "동적 세그먼트의 params가 Promise인 점",
    ],
    group: "server",
  },
  {
    href: "/examples/streaming",
    title: "Suspense 스트리밍",
    summary:
      "지연이 다른 패널 세 개가 셸보다 늦게, 각자 준비되는 순서대로 도착합니다.",
    icon: GaugeIcon,
    checks: [
      "셸 먼저 전송 후 점진적 스트리밍",
      "searchParams Promise를 경계 안에서 await",
      "loading.tsx와 명시적 Suspense 대조",
      "async Server Component",
    ],
    group: "server",
  },
  {
    href: "/examples/error-handling",
    title: "에러 경계와 복구",
    summary:
      "서버와 클라이언트 양쪽에서 에러를 일으키고 Next 16.3의 retry()로 실제 복구까지 확인합니다.",
    icon: TriangleAlertIcon,
    checks: [
      "error.tsx의 { error, retry } props",
      "retry()로 재요청 후 복구 성공",
      "error.digest로 서버 로그 매칭",
      "reset과 retry의 차이",
    ],
    group: "server",
  },
  {
    href: "/examples/posts",
    title: "동적 라우트와 메타데이터",
    summary:
      "[slug] 세그먼트에서 params를 await하고 generateMetadata로 문서 제목을 만듭니다.",
    icon: RouteIcon,
    checks: [
      "params가 Promise인 동적 라우트",
      "generateStaticParams로 빌드 시 프리렌더",
      "generateMetadata로 라우트별 메타데이터",
      "notFound()와 not-found.tsx",
    ],
    group: "server",
  },
  {
    href: "/examples/boundary",
    title: "Server와 Client 경계",
    summary:
      "어느 코드가 서버에서 돌고 어느 코드가 브라우저에서 도는지 렌더 위치를 찍어 구분합니다.",
    icon: SplitIcon,
    checks: [
      "서버 전용 값(process.version) 접근",
      "useSyncExternalStore로 안전하게 클라이언트 값 읽기",
      "children 슬롯으로 서버 컴포넌트 주입",
      "하이드레이션 불일치를 피하는 방법",
    ],
    group: "server",
  },
]

export const exampleGroups: { id: ExampleEntry["group"]; title: string; description: string; icon: LucideIcon }[] = [
  {
    id: "ui",
    title: "스타일과 컴포넌트",
    description: "Tailwind v4 테마, shadcn(Base UI) 프리미티브, 폰트와 에셋을 검증합니다.",
    icon: LayersIcon,
  },
  {
    id: "server",
    title: "Next.js 서버 기능",
    description: "Server Action, Route Handler, 스트리밍, 에러 경계, 동적 라우트를 검증합니다.",
    icon: ServerIcon,
  },
]
