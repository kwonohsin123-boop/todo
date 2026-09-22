import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatServerTime, measuredSleep, sleep } from "@/lib/examples/timing"

/** Suspense fallback. 실제 패널과 높이를 비슷하게 맞춰 레이아웃 이동을 줄입니다. */
export function PanelSkeleton({ label }: { label: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-muted-foreground">{label} 기다리는 중…</CardTitle>
        <CardDescription>이 자리에 fallback이 먼저 도착했습니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  )
}

/** async Server Component. await이 끝난 뒤에야 이 조각이 스트리밍됩니다. */
export async function DelayedPanel({ label, ms }: { label: string; ms: number }) {
  // 시간 측정은 measuredSleep에 맡깁니다.
  // 컴포넌트 본문에서 Date.now()를 직접 부르면 react-hooks/purity 규칙에 걸립니다.
  const elapsed = await measuredSleep(ms)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
        <CardDescription>
          서버에서 {ms}ms를 기다린 뒤 이 조각만 따로 전송되었습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">실제 소요 {elapsed}ms</Badge>
        <Badge variant="outline" className="font-mono text-[10px]">
          렌더 시각 {formatServerTime()}
        </Badge>
      </CardContent>
    </Card>
  )
}

type SearchParamsPanelProps = {
  /** 페이지에서 await하지 않고 Promise 그대로 넘겨받습니다. */
  searchParams: PageProps<"/examples/streaming">["searchParams"]
}

/**
 * searchParams는 요청 시점 데이터라, 페이지 최상단에서 await하면 페이지 전체가
 * 동적 렌더링으로 바뀌고 셸이 먼저 스트리밍되지 못합니다.
 * 그래서 Promise를 그대로 내려받아 Suspense 경계 안에서 await합니다.
 */
export async function SearchParamsPanel({ searchParams }: SearchParamsPanelProps) {
  const params = await searchParams
  const requested = Number(params.delay ?? 0) || 0
  const delay = Math.min(Math.max(requested, 0), 4000)

  if (delay > 0) await sleep(delay)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">searchParams 패널</CardTitle>
        <CardDescription>
          <code className="font-mono">?delay=</code> 값을 바꿔서 이 패널만 늦출 수 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">요청값 {requested}ms</Badge>
        <Badge variant="outline">적용값 {delay}ms (상한 4000)</Badge>
        <Badge variant="outline" className="font-mono text-[10px]">
          {formatServerTime()}
        </Badge>
      </CardContent>
    </Card>
  )
}
