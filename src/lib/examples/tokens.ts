/**
 * Tailwind v4는 소스를 정적으로 스캔합니다.
 * 그래서 `bg-${name}` 처럼 조립한 클래스는 생성되지 않고, 에러도 없이 투명한 박스가 됩니다.
 * 아래 모든 클래스 문자열은 스캐너가 발견할 수 있도록 완성된 리터럴로 적어 두었습니다.
 */

export type ColorPair = {
  /** 배경 토큰 이름 (bg- 접두어 제외) */
  bgName: string
  /** globals.css의 CSS 변수 이름 */
  bgVar: string
  /** 배경 + 짝이 되는 전경색까지 담은 리터럴 클래스 */
  bgClass: string
  /** 짝이 되는 전경 토큰. 없으면 null */
  fgName: string | null
  fgVar: string | null
  /** 전경 토큰을 배경으로 뒤집어 본 리터럴 클래스 */
  fgClass: string | null
  note?: string
}

export type ColorTokenGroup = {
  id: string
  title: string
  description: string
  pairs: ColorPair[]
}

export const colorTokenGroups: ColorTokenGroup[] = [
  {
    id: "surface",
    title: "표면",
    description: "페이지와 카드, 팝오버의 배경 그리고 그 위에 올라가는 본문 색입니다.",
    pairs: [
      {
        bgName: "background",
        bgVar: "--background",
        bgClass: "bg-background text-foreground",
        fgName: "foreground",
        fgVar: "--foreground",
        fgClass: "bg-foreground text-background",
      },
      {
        bgName: "card",
        bgVar: "--card",
        bgClass: "bg-card text-card-foreground",
        fgName: "card-foreground",
        fgVar: "--card-foreground",
        fgClass: "bg-card-foreground text-card",
      },
      {
        bgName: "popover",
        bgVar: "--popover",
        bgClass: "bg-popover text-popover-foreground",
        fgName: "popover-foreground",
        fgVar: "--popover-foreground",
        fgClass: "bg-popover-foreground text-popover",
      },
    ],
  },
  {
    id: "accent",
    title: "강조",
    description: "버튼과 배지, 보조 영역이 쓰는 색 쌍입니다.",
    pairs: [
      {
        bgName: "primary",
        bgVar: "--primary",
        bgClass: "bg-primary text-primary-foreground",
        fgName: "primary-foreground",
        fgVar: "--primary-foreground",
        fgClass: "bg-primary-foreground text-primary",
      },
      {
        bgName: "secondary",
        bgVar: "--secondary",
        bgClass: "bg-secondary text-secondary-foreground",
        fgName: "secondary-foreground",
        fgVar: "--secondary-foreground",
        fgClass: "bg-secondary-foreground text-secondary",
      },
      {
        bgName: "muted",
        bgVar: "--muted",
        bgClass: "bg-muted text-muted-foreground",
        fgName: "muted-foreground",
        fgVar: "--muted-foreground",
        fgClass: "bg-muted-foreground text-muted",
      },
      {
        bgName: "accent",
        bgVar: "--accent",
        bgClass: "bg-accent text-accent-foreground",
        fgName: "accent-foreground",
        fgVar: "--accent-foreground",
        fgClass: "bg-accent-foreground text-accent",
      },
    ],
  },
  {
    id: "state",
    title: "상태",
    description: "이 그룹에는 짝이 되는 전경 토큰이 없습니다.",
    pairs: [
      {
        bgName: "destructive",
        bgVar: "--destructive",
        bgClass: "bg-destructive text-white",
        fgName: null,
        fgVar: null,
        fgClass: null,
        note: "destructive-foreground 토큰이 @theme inline에 없습니다. text-destructive-foreground는 클래스 자체가 생성되지 않아 조용히 무시되므로, shadcn 컴포넌트도 text-white를 씁니다.",
      },
    ],
  },
  {
    id: "line",
    title: "경계와 포커스",
    description: "전역 @layer base가 * 셀렉터에 border-border와 outline-ring/50을 걸어 둡니다.",
    pairs: [
      {
        bgName: "border",
        bgVar: "--border",
        bgClass: "bg-border",
        fgName: null,
        fgVar: null,
        fgClass: null,
        note: "다크에서는 oklch(1 0 0 / 10%)라 알파가 섞입니다.",
      },
      {
        bgName: "input",
        bgVar: "--input",
        bgClass: "bg-input",
        fgName: null,
        fgVar: null,
        fgClass: null,
      },
      {
        bgName: "ring",
        bgVar: "--ring",
        bgClass: "bg-ring",
        fgName: null,
        fgVar: null,
        fgClass: null,
      },
    ],
  },
  {
    id: "chart",
    title: "차트",
    description:
      "PRD §9.2에서 확정한 5색입니다. 라이트와 다크가 서로 다른 값이며, 다크는 밝기를 뒤집은 것이 아니라 다크 배경용으로 따로 계단을 밟았습니다. 구현 규칙 두 가지: ① 한 차트의 계열은 3개까지(4번째부터 yellow와 orange가 한 화면에 올라와 분리 기준을 통과하지 못합니다) ② 라이트 모드 차트에는 직접 라벨이나 표 보기를 반드시 함께 둡니다(aqua·yellow·magenta가 배경 대비 3:1 미만).",
    pairs: [
      {
        bgName: "chart-1",
        bgVar: "--chart-1",
        bgClass: "bg-chart-1",
        fgName: null,
        fgVar: null,
        fgClass: null,
      },
      {
        bgName: "chart-2",
        bgVar: "--chart-2",
        bgClass: "bg-chart-2",
        fgName: null,
        fgVar: null,
        fgClass: null,
      },
      {
        bgName: "chart-3",
        bgVar: "--chart-3",
        bgClass: "bg-chart-3",
        fgName: null,
        fgVar: null,
        fgClass: null,
      },
      {
        bgName: "chart-4",
        bgVar: "--chart-4",
        bgClass: "bg-chart-4",
        fgName: null,
        fgVar: null,
        fgClass: null,
      },
      {
        bgName: "chart-5",
        bgVar: "--chart-5",
        bgClass: "bg-chart-5",
        fgName: null,
        fgVar: null,
        fgClass: null,
      },
    ],
  },
  {
    id: "sidebar",
    title: "사이드바",
    description: "이 스타터 킷에는 사이드바가 없지만 토큰은 정의되어 있습니다.",
    pairs: [
      {
        bgName: "sidebar",
        bgVar: "--sidebar",
        bgClass: "bg-sidebar text-sidebar-foreground",
        fgName: "sidebar-foreground",
        fgVar: "--sidebar-foreground",
        fgClass: "bg-sidebar-foreground text-sidebar",
      },
      {
        bgName: "sidebar-primary",
        bgVar: "--sidebar-primary",
        bgClass: "bg-sidebar-primary text-sidebar-primary-foreground",
        fgName: "sidebar-primary-foreground",
        fgVar: "--sidebar-primary-foreground",
        fgClass: "bg-sidebar-primary-foreground text-sidebar-primary",
        note: "다크에서만 보라색 계열로 바뀌어, 크롬 토큰 중 유일하게 무채색이 아닌 토큰입니다. (차트 5색은 PRD §9.2에 따라 데이터 전용 유채색입니다)",
      },
      {
        bgName: "sidebar-accent",
        bgVar: "--sidebar-accent",
        bgClass: "bg-sidebar-accent text-sidebar-accent-foreground",
        fgName: "sidebar-accent-foreground",
        fgVar: "--sidebar-accent-foreground",
        fgClass: "bg-sidebar-accent-foreground text-sidebar-accent",
      },
      {
        bgName: "sidebar-border",
        bgVar: "--sidebar-border",
        bgClass: "bg-sidebar-border",
        fgName: null,
        fgVar: null,
        fgClass: null,
      },
      {
        bgName: "sidebar-ring",
        bgVar: "--sidebar-ring",
        bgClass: "bg-sidebar-ring",
        fgName: null,
        fgVar: null,
        fgClass: null,
      },
    ],
  },
]

/** 실측 표에 넘길 CSS 변수 목록. 그룹 정의에서 그대로 파생시킵니다. */
export const colorTokenVars: string[] = colorTokenGroups.flatMap((group) =>
  group.pairs.flatMap((pair) => (pair.fgVar ? [pair.bgVar, pair.fgVar] : [pair.bgVar]))
)

export type RadiusStep = {
  className: string
  /** 미리보기 박스에 실제로 적용할 리터럴 클래스 */
  previewClass: string
  formula: string
  computed: string
  note?: string
}

export const radiusScale: RadiusStep[] = [
  {
    className: "rounded-none",
    previewClass: "rounded-none",
    formula: "0",
    computed: "0",
  },
  {
    className: "rounded-xs",
    previewClass: "rounded-xs",
    formula: "calc(var(--radius) * 0.4)",
    computed: "0.15rem",
  },
  {
    className: "rounded-sm",
    previewClass: "rounded-sm",
    formula: "calc(var(--radius) * 0.6)",
    computed: "0.225rem",
  },
  {
    className: "rounded-md",
    previewClass: "rounded-md",
    formula: "calc(var(--radius) * 0.8)",
    computed: "0.3rem",
  },
  {
    className: "rounded-lg",
    previewClass: "rounded-lg",
    formula: "var(--radius)",
    computed: "0.375rem",
  },
  {
    className: "rounded-xl",
    previewClass: "rounded-xl",
    formula: "calc(var(--radius) * 1.4)",
    computed: "0.525rem",
  },
  {
    className: "rounded-2xl",
    previewClass: "rounded-2xl",
    formula: "calc(var(--radius) * 1.8)",
    computed: "0.675rem",
  },
  {
    className: "rounded-3xl",
    previewClass: "rounded-3xl",
    formula: "calc(var(--radius) * 2.2)",
    computed: "0.825rem",
  },
  {
    className: "rounded-4xl",
    previewClass: "rounded-4xl",
    formula: "calc(var(--radius) * 2.6)",
    computed: "0.975rem",
  },
  {
    className: "rounded-full",
    previewClass: "rounded-full",
    formula: "Tailwind 기본값",
    computed: "calc(infinity * 1px)",
  },
]

export type DataVariant = {
  name: string
  selector: string
  consumer: string
}

/** shadcn/tailwind.css가 import로 함께 들여오는 숨은 변형들입니다. */
export const dataVariants: DataVariant[] = [
  {
    name: "data-open",
    selector: '[data-state="open"], [data-open]:not([data-open="false"])',
    consumer: "Dialog · Popover · DropdownMenu · Accordion",
  },
  {
    name: "data-closed",
    selector: '[data-state="closed"], [data-closed]:not([data-closed="false"])',
    consumer: "같은 오버레이들의 닫힘 애니메이션",
  },
  {
    name: "data-checked",
    selector: '[data-state="checked"], [data-checked]:not([data-checked="false"])',
    consumer: "Checkbox · Switch · RadioGroupItem",
  },
  {
    name: "data-unchecked",
    selector: '[data-state="unchecked"], [data-unchecked]:not([data-unchecked="false"])',
    consumer: "Switch 트랙 배경",
  },
  {
    name: "data-selected",
    selector: '[data-selected="true"]',
    consumer: "Select 항목 — 유일하게 값까지 true여야 맞습니다",
  },
  {
    name: "data-disabled",
    selector: '[data-disabled="true"], [data-disabled]:not([data-disabled="false"])',
    consumer: "Switch · SelectItem · AccordionTrigger",
  },
  {
    name: "data-active",
    selector: '[data-state="active"], [data-active]:not([data-active="false"])',
    consumer: "TabsTrigger",
  },
  {
    name: "data-horizontal",
    selector: '[data-orientation="horizontal"]',
    consumer: "Tabs · Separator",
  },
  {
    name: "data-vertical",
    selector: '[data-orientation="vertical"]',
    consumer: "Tabs · Separator",
  },
]

export type UtilityDemo = {
  className: string
  label: string
  description: string
}

/** shimmer는 background-clip: text이므로 텍스트에만 적용됩니다. */
export const shimmerDemos: UtilityDemo[] = [
  { className: "shimmer", label: "shimmer", description: "기본값. 2초 주기로 무한 반복" },
  { className: "shimmer shimmer-once", label: "shimmer-once", description: "한 번만 재생" },
  {
    className: "shimmer shimmer-reverse",
    label: "shimmer-reverse",
    description: "진행 방향 반대",
  },
  {
    className: "shimmer shimmer-color-primary",
    label: "shimmer-color-primary",
    description: "하이라이트 색을 테마 토큰으로",
  },
  {
    className: "shimmer shimmer-duration-800",
    label: "shimmer-duration-800",
    description: "주기를 800ms로",
  },
  {
    className: "shimmer shimmer-spread-24",
    label: "shimmer-spread-24",
    description: "하이라이트 폭을 넓게",
  },
  {
    className: "shimmer shimmer-angle-45",
    label: "shimmer-angle-45",
    description: "그라디언트 각도 45도",
  },
]
