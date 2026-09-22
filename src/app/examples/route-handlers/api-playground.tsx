"use client"

import * as React from "react"
import { LoaderCircleIcon, PlayIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ApiRequest = {
  id: string
  label: string
  method: "GET" | "POST"
  path: string
  body?: unknown
  hint: string
}

const requests: ApiRequest[] = [
  {
    id: "posts",
    label: "목록",
    method: "GET",
    path: "/api/posts",
    hint: "기본 응답. x-example-source 헤더가 함께 옵니다.",
  },
  {
    id: "search",
    label: "검색",
    method: "GET",
    path: "/api/posts?q=tailwind",
    hint: "nextUrl.searchParams로 쿼리를 읽습니다.",
  },
  {
    id: "delay",
    label: "지연 1.5초",
    method: "GET",
    path: "/api/posts?delay=1500",
    hint: "상한 5000ms로 클램프됩니다.",
  },
  {
    id: "single",
    label: "단건",
    method: "GET",
    path: "/api/posts/tailwind-v4",
    hint: "동적 세그먼트. ctx.params가 Promise입니다.",
  },
  {
    id: "notfound",
    label: "없는 slug",
    method: "GET",
    path: "/api/posts/없는-글",
    hint: "404 JSON을 직접 만들어 반환합니다.",
  },
  {
    id: "fail400",
    label: "400",
    method: "GET",
    path: "/api/posts?fail=400",
    hint: "의도적인 클라이언트 오류 응답.",
  },
  {
    id: "throw",
    label: "예외 발생",
    method: "GET",
    path: "/api/posts?fail=throw",
    hint: "핸들러에서 throw하면 Next가 500으로 변환합니다.",
  },
  {
    id: "time",
    label: "시각 (캐시 안 됨)",
    method: "GET",
    path: "/api/time",
    hint: "연속으로 눌러 보세요. 매번 시각이 바뀝니다.",
  },
  {
    id: "cached-time",
    label: "시각 (force-static)",
    method: "GET",
    path: "/api/cached-time",
    hint: "프로덕션 빌드에서는 빌드 시각으로 고정됩니다. dev에서는 매번 바뀝니다.",
  },
  {
    id: "post-ok",
    label: "생성 성공",
    method: "POST",
    path: "/api/posts",
    body: { title: "새 글 제목" },
    hint: "201과 함께 생성 결과를 돌려줍니다.",
  },
  {
    id: "post-invalid",
    label: "생성 실패",
    method: "POST",
    path: "/api/posts",
    body: { title: "x" },
    hint: "title이 2자 미만이면 400.",
  },
  {
    id: "post-broken",
    label: "깨진 JSON",
    method: "POST",
    path: "/api/posts",
    body: "{ not json",
    hint: "request.json() 실패를 try/catch로 잡아 400을 반환합니다.",
  },
]

type Result = {
  status: number
  statusText: string
  elapsedMs: number
  headers: [string, string][]
  body: string
}

/**
 * 실제 요청은 컴포넌트 밖에서 수행합니다.
 * performance.now() 같은 불순한 호출을 컴포넌트 본문 안에서 하면
 * react-hooks/purity 규칙(렌더는 멱등해야 한다)에 걸립니다.
 */
async function runRequest(request: ApiRequest): Promise<Result> {
  const startedAt = performance.now()

  const response = await fetch(request.path, {
    method: request.method,
    ...(request.method === "POST"
      ? {
          headers: { "content-type": "application/json" },
          body:
            typeof request.body === "string"
              ? request.body
              : JSON.stringify(request.body),
        }
      : {}),
  })

  const elapsedMs = Math.round(performance.now() - startedAt)
  const text = await response.text()

  let body: string
  try {
    body = JSON.stringify(JSON.parse(text), null, 2)
  } catch {
    // JSON이 아니면 원문을 그대로 보여줍니다 (예: 500 HTML 페이지).
    body = text.slice(0, 1200)
  }

  return {
    status: response.status,
    statusText: response.statusText,
    elapsedMs,
    headers: Array.from(response.headers.entries()),
    body,
  }
}

export function ApiPlayground() {
  const [pendingId, setPendingId] = React.useState<string | null>(null)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<Result | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  async function run(request: ApiRequest) {
    setPendingId(request.id)
    setActiveId(request.id)
    setError(null)

    try {
      setResult(await runRequest(request))
    } catch (caught) {
      setResult(null)
      setError(caught instanceof Error ? caught.message : "요청에 실패했습니다.")
    } finally {
      setPendingId(null)
    }
  }

  const activeRequest = requests.find((request) => request.id === activeId)

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">요청</CardTitle>
          <CardDescription>
            버튼을 누르면 브라우저에서 같은 출처의 /api 로 fetch합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {requests.map((request) => (
            <div key={request.id} className="space-y-0.5">
              <Button
                variant={activeId === request.id ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                disabled={pendingId !== null}
                onClick={() => run(request)}
              >
                {pendingId === request.id ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : (
                  <PlayIcon />
                )}
                <span className="font-mono text-[11px]">
                  {request.method} {request.path}
                </span>
              </Button>
              <p className="pl-8 text-[10px] leading-snug text-muted-foreground">
                {request.label} — {request.hint}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">응답</CardTitle>
          <CardDescription>
            {activeRequest
              ? `${activeRequest.method} ${activeRequest.path}`
              : "왼쪽에서 요청을 하나 골라 보세요."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {result ? (
            <>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={result.status < 400 ? "secondary" : "destructive"}>
                  {result.status} {result.statusText}
                </Badge>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {result.elapsedMs} ms
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium">응답 헤더</p>
                <div className="flex flex-wrap gap-1">
                  {result.headers.map(([name, value]) => (
                    <Badge key={name} variant="outline" className="font-mono text-[10px]">
                      {name}: {value}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium">본문</p>
                <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed">
                  {result.body}
                </pre>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
