import { Suspense } from "react"
import Link from "next/link"
import { cn } from "cn"

import { Code } from "@/components/examples/code"
import { ExamplePageHeader } from "@/components/examples/example-page-header"
import { Section } from "@/components/examples/section"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { DelayedPanel, PanelSkeleton, SearchParamsPanel } from "./panels"

export const metadata = {
  title: "Suspense 스트리밍",
  description: "셸을 먼저 보내고 준비된 조각부터 순서대로 스트리밍하는 예제",
}

export default function StreamingExamplePage(props: PageProps<"/examples/streaming">) {
  // 여기서 props.searchParams를 await하지 않습니다.
  // 최상단에서 await하면 이 페이지 전체가 동적 렌더링이 되어 셸이 먼저 나가지 못합니다.
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-14">
      {/* 이 위쪽은 즉시 전송되는 정적 셸입니다. */}
      <ExamplePageHeader
        title="Suspense 스트리밍"
        description="아래 패널 네 개는 서로 다른 시간을 기다립니다. 페이지 제목과 설명은 곧바로 보이고, 각 패널은 준비된 순서대로 자리를 채웁니다. 새로고침하면 스켈레톤이 순차적으로 사라지는 걸 볼 수 있습니다."
        checks={["셸 먼저 전송", "독립적인 Suspense 경계", "searchParams Promise", "loading.tsx 대조"]}
      />

      <Separator />

      <Section
        id="panels"
        title="독립적인 경계 네 개"
        description={
          <>
            형제 <Code>{"<Suspense>"}</Code>는 각각 독립적으로 스트리밍됩니다. 느린 패널이 빠른
            패널을 붙잡지 않습니다.
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Suspense fallback={<PanelSkeleton label="300ms 패널" />}>
            <DelayedPanel label="빠름 · 300ms" ms={300} />
          </Suspense>

          <Suspense fallback={<PanelSkeleton label="900ms 패널" />}>
            <DelayedPanel label="보통 · 900ms" ms={900} />
          </Suspense>

          <Suspense fallback={<PanelSkeleton label="1800ms 패널" />}>
            <DelayedPanel label="느림 · 1800ms" ms={1800} />
          </Suspense>

          <Suspense fallback={<PanelSkeleton label="searchParams 패널" />}>
            <SearchParamsPanel searchParams={props.searchParams} />
          </Suspense>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/examples/streaming"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            기본
          </Link>
          <Link
            href="/examples/streaming?delay=2500"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            ?delay=2500
          </Link>
          <Link
            href="/examples/streaming?delay=99999"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            ?delay=99999 (상한 적용)
          </Link>
        </div>
      </Section>

      <Separator />

      <Section id="notes" title="확인할 점">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card size="sm">
            <CardHeader>
              <CardTitle>동적 접근은 아래로 밀어 내립니다</CardTitle>
              <CardDescription>
                <Code>params</Code> · <Code>searchParams</Code> · <Code>cookies()</Code> ·{" "}
                <Code>headers()</Code>를 페이지 최상단에서 <Code>await</Code>하면 그 아래 전체가
                동적이 되어 정적 셸에 들어가지 못합니다. Promise를 그대로 자식에게 넘기고 경계
                안에서 풀어야 합니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>loading.tsx는 세그먼트 전체를 감쌉니다</CardTitle>
              <CardDescription>
                이 세그먼트에도 <Code>loading.tsx</Code>가 있어서 라우트 전환 직후 한 번
                보입니다. 공식 문서는 <Code>loading.js</Code>보다 데이터 접근부에 가까운 명시적{" "}
                <Code>{"<Suspense>"}</Code>를 권장합니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>스트리밍이 시작되면 상태 코드를 못 바꿉니다</CardTitle>
              <CardDescription>
                첫 바이트가 나가는 순간 200으로 확정됩니다. 중간에{" "}
                <Code>notFound()</Code>가 나오면 404 대신{" "}
                <Code>{'<meta name="robots" content="noindex">'}</Code>가 주입되고,{" "}
                <Code>redirect()</Code>는 클라이언트 리다이렉트로 바뀝니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>정적 export에서는 동작하지 않습니다</CardTitle>
              <CardDescription>
                <Code>output: &quot;export&quot;</Code>로 정적 내보내기를 하면 스트리밍이
                지원되지 않습니다.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>
    </div>
  )
}
