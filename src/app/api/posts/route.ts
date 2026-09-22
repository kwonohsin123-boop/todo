import { NextResponse, type NextRequest } from "next/server"

import { getPosts } from "@/lib/examples/posts"
import { sleep } from "@/lib/examples/timing"

/**
 * Next.js 16에서 Route Handler는 기본적으로 캐시되지 않습니다.
 * (Next 15 RC부터 GET의 기본값이 static에서 dynamic으로 바뀌었습니다.)
 * 캐시 opt-in 예시는 /api/cached-time 에 있습니다.
 *
 * 쿼리 파라미터
 *   ?q=키워드      제목 · 태그 · slug 부분 일치 검색
 *   ?delay=1200    인위적 지연 (최대 5000ms로 클램프)
 *   ?fail=400      400 응답
 *   ?fail=500      500 응답
 *   ?fail=throw    처리되지 않은 예외 (결과적으로 500)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const startedAt = Date.now()

  // 요청이 무한정 붙잡히지 않도록 상한을 둡니다.
  const delay = Math.min(Math.max(Number(searchParams.get("delay") ?? 0) || 0, 0), 5000)
  const fail = searchParams.get("fail")
  const query = searchParams.get("q")?.trim() ?? ""

  if (delay > 0) await sleep(delay)

  if (fail === "400") {
    return NextResponse.json(
      { error: "잘못된 요청 예시입니다.", hint: "fail 쿼리를 빼면 정상 응답합니다." },
      { status: 400 }
    )
  }
  if (fail === "500") {
    return NextResponse.json({ error: "서버 오류 예시입니다." }, { status: 500 })
  }
  if (fail === "throw") {
    // 핸들러에서 throw하면 Next가 500으로 변환합니다.
    throw new Error("처리되지 않은 예외 예시입니다.")
  }

  const items = getPosts(query)

  return NextResponse.json(
    {
      items,
      count: items.length,
      query,
      delay,
      elapsedMs: Date.now() - startedAt,
      generatedAt: new Date().toISOString(),
    },
    { headers: { "x-example-source": "route-handler" } }
  )
}

/** POST는 GET과 같은 파일에 있어도 캐시되지 않습니다. */
export async function POST(request: NextRequest) {
  // any를 쓰지 않고 unknown으로 받아 좁혀 나갑니다.
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: "JSON 파싱에 실패했습니다.", contentType: request.headers.get("content-type") },
      { status: 400 }
    )
  }

  const title =
    typeof payload === "object" && payload !== null && "title" in payload
      ? String((payload as { title: unknown }).title ?? "").trim()
      : ""

  if (title.length < 2) {
    return NextResponse.json(
      { error: "title은 2자 이상이어야 합니다.", received: title },
      { status: 400 }
    )
  }

  return NextResponse.json(
    { ok: true, title, createdAt: new Date().toISOString() },
    { status: 201 }
  )
}
