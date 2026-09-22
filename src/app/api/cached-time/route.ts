import { NextResponse } from "next/server"

/**
 * GET만 캐시 opt-in이 가능합니다.
 * force-static이면 request 객체를 쓸 수 없으므로 인자 없는 GET으로 선언합니다.
 * 프로덕션 빌드에서는 시각이 빌드 시점으로 고정되고, dev에서는 매번 새로 실행됩니다.
 */
export const dynamic = "force-static"

export async function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    cache: 'export const dynamic = "force-static" — 프로덕션에서는 빌드 시각으로 고정됩니다.',
  })
}
