import { NextResponse } from "next/server"

/**
 * 캐시 기본값 대조군입니다.
 * 세그먼트 설정을 아무것도 주지 않았으므로 매 요청마다 실행되어 시각이 계속 바뀝니다.
 */
export async function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    cache: "기본값 — 캐시되지 않습니다. 호출할 때마다 시각이 바뀝니다.",
  })
}
