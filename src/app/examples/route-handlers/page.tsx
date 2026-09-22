import { Code } from "@/components/examples/code"
import { ExamplePageHeader } from "@/components/examples/example-page-header"
import { Section } from "@/components/examples/section"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ApiPlayground } from "./api-playground"

export const metadata = {
  title: "Route Handler와 캐싱",
  description: "app/api 의 Route Handler 시그니처와 Next.js 16의 캐시 기본값을 검증하는 화면",
}

const endpoints = [
  {
    path: "/api/posts",
    methods: "GET · POST",
    file: "src/app/api/posts/route.ts",
    note: "쿼리로 검색 · 지연 · 실패를 재현합니다. POST는 JSON 본문을 검증합니다.",
  },
  {
    path: "/api/posts/[slug]",
    methods: "GET",
    file: "src/app/api/posts/[slug]/route.ts",
    note: "RouteContext 전역 타입을 쓰고 ctx.params를 await합니다.",
  },
  {
    path: "/api/time",
    methods: "GET",
    file: "src/app/api/time/route.ts",
    note: "세그먼트 설정 없음 — 매 요청 실행됩니다.",
  },
  {
    path: "/api/cached-time",
    methods: "GET",
    file: "src/app/api/cached-time/route.ts",
    note: 'dynamic = "force-static" — 프로덕션에서 빌드 시각으로 고정됩니다.',
  },
]

export default function RouteHandlersExamplePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-14">
      <ExamplePageHeader
        title="Route Handler와 캐싱"
        description="app/api 아래의 route.ts가 HTTP 엔드포인트가 됩니다. Next.js 15 RC부터 GET의 캐시 기본값이 static에서 dynamic으로 바뀌었기 때문에, 예전 예제를 그대로 옮기면 캐시 동작이 달라집니다. 아래 플레이그라운드로 직접 호출해 확인하세요."
        checks={["GET · POST 시그니처", "캐시 기본값", "force-static opt-in", "params는 Promise"]}
      />

      <Separator />

      <Section id="playground" title="플레이그라운드">
        <ApiPlayground />
      </Section>

      <Separator />

      <Section id="endpoints" title="엔드포인트 목록">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">경로</TableHead>
                <TableHead className="w-24">메서드</TableHead>
                <TableHead>설명</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {endpoints.map((endpoint) => (
                <TableRow key={endpoint.path}>
                  <TableCell className="align-top">
                    <p className="font-mono text-xs">{endpoint.path}</p>
                    <p className="mt-1 font-mono text-[10px] break-all text-muted-foreground">
                      {endpoint.file}
                    </p>
                  </TableCell>
                  <TableCell className="align-top font-mono text-xs">
                    {endpoint.methods}
                  </TableCell>
                  <TableCell className="align-top text-xs">{endpoint.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Separator />

      <Section id="notes" title="확인할 점">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card size="sm">
            <CardHeader>
              <CardTitle>기본적으로 캐시되지 않습니다</CardTitle>
              <CardDescription>
                캐시가 필요하면 <Code>export const dynamic = &quot;force-static&quot;</Code>으로{" "}
                <strong>GET만</strong> opt-in할 수 있습니다. 같은 파일의 POST 등 다른 메서드는
                여전히 캐시되지 않습니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>force-static에서는 request를 쓸 수 없습니다</CardTitle>
              <CardDescription>
                요청마다 달라지는 값을 읽으면 정적 생성과 모순이 되므로,{" "}
                <Code>/api/cached-time</Code>은 인자 없는 <Code>GET()</Code>으로 선언했습니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>params는 Promise입니다</CardTitle>
              <CardDescription>
                두 번째 인자의 <Code>ctx.params</Code>를 <Code>await</Code>해야 합니다. Next.js
                16에서 동기 접근은 완전히 제거되었습니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>RouteContext는 import하지 않습니다</CardTitle>
              <CardDescription>
                <Code>RouteContext&lt;&quot;/api/posts/[slug]&quot;&gt;</Code>는 라우트 문자열로
                생성되는 전역 타입입니다. 새 라우트를 추가한 뒤에는{" "}
                <Code>next dev</Code> 또는 <Code>next build</Code>를 한 번 돌려야 타입이 생깁니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>미지원 메서드는 405입니다</CardTitle>
              <CardDescription>
                정의하지 않은 메서드로 요청하면 Next가 자동으로 405를 반환하고,{" "}
                <Code>OPTIONS</Code>를 정의하지 않으면 <Code>Allow</Code> 헤더를 포함해 자동
                구현합니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>any 대신 unknown</CardTitle>
              <CardDescription>
                <Code>no-explicit-any</Code>가 error이므로 <Code>request.json()</Code>의 결과는{" "}
                <Code>unknown</Code>으로 받아 좁혀 씁니다.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>
    </div>
  )
}
