import Link from "next/link"
import { cn } from "cn"

import { Code } from "@/components/examples/code"
import { ExamplePageHeader } from "@/components/examples/example-page-header"
import { Section } from "@/components/examples/section"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { failOnce } from "@/lib/examples/flaky"

import { BoomButton } from "./boom-button"

export const metadata = {
  title: "에러 경계와 복구",
  description: "error.tsx의 retry로 실제 복구까지 확인하는 예제",
}

export default async function ErrorHandlingExamplePage({
  searchParams,
}: PageProps<"/examples/error-handling">) {
  const { boom } = await searchParams

  if (boom === "server") {
    throw new Error("서버 컴포넌트에서 의도적으로 던진 예외입니다.")
  }

  if (boom === "once") {
    // 첫 호출만 실패합니다. 그래서 retry() 한 번으로 복구됩니다.
    failOnce("error-handling")
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-14">
      <ExamplePageHeader
        title="에러 경계와 복구"
        description="error.tsx는 같은 세그먼트의 page.tsx와 그 하위를 감쌉니다. Next.js 16.3에서 stable이 된 retry()는 단순히 에러 상태를 지우는 것이 아니라 children을 다시 fetch하고 다시 렌더합니다. 그 차이를 확인할 수 있도록, 한 번만 실패하는 트리거를 넣어 두었습니다."
        checks={["error.tsx 경계", "retry()로 복구", "error.digest", "클라이언트 예외"]}
      />

      <Separator />

      <Section
        id="triggers"
        title="에러 트리거"
        description="각 링크는 에러 화면으로 이동합니다. 거기서 '다시 시도'를 눌러 결과를 비교해 보세요."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">한 번만 실패</CardTitle>
              <CardDescription>
                <Code>failOnce()</Code>가 첫 호출에만 예외를 던집니다. 에러 화면에서 다시 시도를
                누르면 <strong>복구에 성공</strong>해 이 페이지로 돌아옵니다.
              </CardDescription>
            </CardHeader>
            <div className="px-4">
              <Link
                href="/examples/error-handling?boom=once"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                ?boom=once
              </Link>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">항상 실패</CardTitle>
              <CardDescription>
                조건이 그대로이므로 다시 시도해도 같은 예외가 납니다. retry()가 마법이 아니라{" "}
                <strong>재실행</strong>이라는 점을 보여 줍니다.
              </CardDescription>
            </CardHeader>
            <div className="px-4">
              <Link
                href="/examples/error-handling?boom=server"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                ?boom=server
              </Link>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">클라이언트 렌더 중 예외</CardTitle>
              <CardDescription>
                클라이언트 컴포넌트가 던진 예외도 같은 경계가 잡습니다. 이벤트 핸들러에서 바로
                throw하면 React 트리 밖이라 걸리지 않으므로, 상태를 바꿔 다음 렌더에서 던집니다.
              </CardDescription>
            </CardHeader>
            <div className="px-4">
              <BoomButton />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">존재하지 않는 경로</CardTitle>
              <CardDescription>
                에러와 404는 다른 경로로 처리됩니다. 404는{" "}
                <Link
                  href="/examples/posts/없는-글"
                  className="underline underline-offset-4"
                >
                  동적 라우트 예제
                </Link>
                에서 확인하세요.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Separator />

      <Section id="notes" title="확인할 점">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card size="sm">
            <CardHeader>
              <CardTitle>retry와 reset의 차이</CardTitle>
              <CardDescription>
                <Code>retry()</Code>는 children을 다시 fetch하고 다시 렌더합니다.{" "}
                <Code>reset()</Code>은 refetch 없이 에러 상태만 초기화합니다. 문서는 특별한 이유가
                없으면 <Code>retry()</Code>를 쓰라고 합니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>같은 세그먼트의 layout은 감싸지 않습니다</CardTitle>
              <CardDescription>
                <Code>error.tsx</Code>는 <Code>loading.tsx</Code> · <Code>not-found.tsx</Code> ·{" "}
                <Code>page.tsx</Code> · 하위 <Code>layout.tsx</Code>를 감쌉니다. 루트 레이아웃의
                에러는 <Code>app/global-error.tsx</Code>가 필요합니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>프로덕션에서는 메시지가 일반화됩니다</CardTitle>
              <CardDescription>
                서버 컴포넌트의 에러 메시지는 프로덕션에서 감춰지고,{" "}
                <Code>error.digest</Code>로 서버 로그와 대조합니다. 개발 모드에서는 원본 메시지가
                그대로 보입니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>스트리밍 중 에러는 화면 교체입니다</CardTitle>
              <CardDescription>
                이미 전송이 시작된 뒤라면 상태 코드를 바꿀 수 없으므로, 응답은 200인 채로 에러
                UI가 클라이언트에서 교체됩니다.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>
    </div>
  )
}
