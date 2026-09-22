import { NextResponse, type NextRequest } from "next/server"

import { getPost } from "@/lib/examples/posts"

/**
 * 두 번째 인자의 params는 Promise입니다. Next.js 16에서는 동기 접근이 제거되었습니다.
 * RouteContext는 라우트 문자열로 생성되는 전역 타입이라 import가 필요하지 않습니다.
 * (새 라우트를 추가한 뒤에는 next dev 또는 next build를 한 번 돌려야 타입이 생깁니다.)
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/posts/[slug]">) {
  const { slug } = await ctx.params
  const post = getPost(slug)

  if (!post) {
    return NextResponse.json(
      { error: "찾을 수 없습니다.", slug, path: request.nextUrl.pathname },
      { status: 404 }
    )
  }

  return NextResponse.json({ post, path: request.nextUrl.pathname })
}
