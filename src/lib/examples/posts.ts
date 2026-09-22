export type Post = {
  slug: string
  title: string
  summary: string
  body: string
  tag: string
  publishedAt: string
}

/** 예제용 목업 데이터. 실제 프로젝트에서는 이 자리에 DB 조회가 들어갑니다. */
export const POSTS: Post[] = [
  {
    slug: "server-components",
    title: "Server Component가 기본입니다",
    summary: "src/app/** 아래 컴포넌트는 별도 지시어 없이 서버에서 렌더됩니다.",
    body: "브라우저 번들에 포함되지 않으므로 DB 접근이나 비밀 값 사용이 가능합니다. 상태와 이벤트 핸들러가 필요한 지점에서만 \"use client\"로 경계를 내립니다.",
    tag: "React 19",
    publishedAt: "2026-01-12",
  },
  {
    slug: "route-handlers",
    title: "Route Handler는 기본적으로 캐시되지 않습니다",
    summary: "Next 15부터 GET의 기본값이 static에서 dynamic으로 바뀌었습니다.",
    body: "캐시가 필요하면 GET에 export const dynamic = \"force-static\"을 붙여 opt-in 합니다. GET 외의 메서드는 같은 파일에 있어도 캐시되지 않습니다.",
    tag: "Next.js 16",
    publishedAt: "2026-01-20",
  },
  {
    slug: "tailwind-v4",
    title: "설정 파일이 없는 Tailwind v4",
    summary: "tailwind.config 대신 globals.css의 @theme 블록이 테마를 정의합니다.",
    body: "색 토큰 하나를 추가하려면 :root, .dark, @theme inline 세 군데를 함께 고쳐야 합니다. 하나만 빠지면 빌드 에러 없이 조용히 실패합니다.",
    tag: "Tailwind CSS 4",
    publishedAt: "2026-02-03",
  },
  {
    slug: "base-ui",
    title: "프리미티브가 Radix가 아니라 Base UI입니다",
    summary: "트리거 합성은 asChild가 아니라 render prop으로 합니다.",
    body: "웹의 shadcn 예제 대부분은 Radix 기준이라 그대로 붙여넣으면 동작하지 않습니다. 열림 상태도 data-state가 아니라 data-open입니다.",
    tag: "shadcn/ui",
    publishedAt: "2026-02-18",
  },
  {
    slug: "dark-mode",
    title: "다크 모드는 다섯 조각이 맞아야 동작합니다",
    summary: "@custom-variant 한 줄이 v3의 darkMode 설정 키를 대체합니다.",
    body: "변형 정의, 토큰 세트, @theme inline 연결, ThemeProvider의 class 주입, suppressHydrationWarning 다섯 조각 중 하나라도 어긋나면 조용히 실패합니다.",
    tag: "next-themes",
    publishedAt: "2026-03-05",
  },
  {
    slug: "turbopack",
    title: "Turbopack이 기본 번들러입니다",
    summary: "Next.js 16부터 dev와 build 모두 Turbopack을 씁니다.",
    body: "--turbopack 플래그가 필요하지 않습니다. 그리고 next lint 명령이 제거되어 린트는 eslint를 직접 실행해야 합니다.",
    tag: "Next.js 16",
    publishedAt: "2026-03-21",
  },
]

export function getPosts(query = ""): Post[] {
  const keyword = query.trim().toLowerCase()
  if (!keyword) return POSTS
  return POSTS.filter(
    (post) =>
      post.title.toLowerCase().includes(keyword) ||
      post.tag.toLowerCase().includes(keyword) ||
      post.slug.includes(keyword)
  )
}

export function getPost(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug)
}

export function getPostSlugs(): string[] {
  return POSTS.map((post) => post.slug)
}
