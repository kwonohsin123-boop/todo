import { TriangleAlertIcon } from "lucide-react"

import { Code } from "@/components/examples/code"
import { ExamplePageHeader } from "@/components/examples/example-page-header"
import { Section } from "@/components/examples/section"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { listGuestbookEntries } from "@/lib/examples/guestbook"
import { formatServerTime } from "@/lib/examples/timing"

import { GuestbookForm } from "./guestbook-form"

export const metadata = {
  title: "Server Action",
  description: "useActionState와 서버 유효성 검사, revalidatePath를 검증하는 화면",
}

export default function ServerActionsExamplePage() {
  const entries = listGuestbookEntries()

  // 이 페이지는 동적 API를 쓰지 않으므로 빌드 시점에 프리렌더됩니다.
  // 따라서 프로덕션에서 이 시각은 revalidatePath가 호출될 때만 바뀝니다.
  const renderedAt = formatServerTime()

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-14">
      <ExamplePageHeader
        title="Server Action"
        description="form의 action에 서버 함수를 직접 연결합니다. 네트워크 요청을 손으로 만들지 않고, 클라이언트 번들에는 함수 참조만 들어갑니다. 제출해 보면 pending 상태와 서버 검증 결과, 그리고 revalidatePath 이후의 서버 렌더 시각 변화를 함께 볼 수 있습니다."
        checks={["form action 연결", "useActionState", "서버 검증", "revalidatePath"]}
      />

      <Separator />

      <Section
        id="form"
        title="방명록 폼"
        description={
          <>
            이름을 1자만 넣거나 내용을 비워 제출해 보세요. 클라이언트에서 막지 않고{" "}
            <strong>서버에서</strong> 검증해 결과를 돌려줍니다.
          </>
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">제출</CardTitle>
              <CardDescription>
                액션은 <Code>await sleep(700)</Code>으로 일부러 느리게 만들어 두었습니다.
                버튼이 비활성으로 바뀌고 스피너가 도는지 보세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GuestbookForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">서버가 렌더한 목록</CardTitle>
              <CardDescription>
                이 목록과 아래 시각은 서버 컴포넌트가 만든 것입니다. 제출이 성공하면{" "}
                <Code>revalidatePath</Code>가 이 경로를 다시 렌더합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">서버 렌더 시각</Badge>
                <span className="font-mono text-xs">{renderedAt}</span>
              </div>

              <ul className="space-y-2.5">
                {entries.map((entry) => (
                  <li key={entry.id} className="rounded-lg border p-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-medium">{entry.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {formatServerTime(new Date(entry.createdAt))}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{entry.body}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Separator />

      <Section id="notes" title="확인할 점">
        <div className="space-y-3">
          <Alert>
            <TriangleAlertIcon />
            <AlertTitle>서버 렌더 시각은 프로덕션 빌드에서 확인해야 합니다</AlertTitle>
            <AlertDescription>
              <p>
                <Code>next dev</Code>에서는 요청마다 다시 렌더되므로 시각이 항상 새로 찍혀{" "}
                <Code>revalidatePath</Code>의 효과가 구분되지 않습니다.{" "}
                <Code>npm run build &amp;&amp; npm run start</Code>로 실행하면, 처음에는 빌드
                시각이 고정되어 있다가 제출에 성공한 뒤에만 갱신되는 것을 볼 수 있습니다.
              </p>
            </AlertDescription>
          </Alert>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card size="sm">
              <CardHeader>
                <CardTitle>타입과 상수는 액션 파일 밖에</CardTitle>
                <CardDescription>
                  <Code>&apos;use server&apos;</Code> 파일의 모든 export는 async여야 합니다. 그래서{" "}
                  <Code>GuestbookFormState</Code>와 <Code>initialGuestbookState</Code>는{" "}
                  <Code>src/lib/examples/guestbook.ts</Code>에 두었습니다.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>aria-invalid에 false를 넘기지 마세요</CardTitle>
                <CardDescription>
                  <Code>aria-invalid=&#123;false&#125;</Code>는 속성이 렌더되어{" "}
                  <Code>aria-invalid:</Code> 변형이 걸려 버립니다.{" "}
                  <Code>Boolean(error) || undefined</Code>로 속성 자체를 빼야 합니다.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>인메모리 저장소입니다</CardTitle>
                <CardDescription>
                  방명록은 모듈 스코프 배열이라 서버 재시작과 HMR에 초기화되고, 여러 인스턴스
                  간에도 공유되지 않습니다. 실제 프로젝트에서는 DB 호출로 바꾸세요.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>revalidateTag는 인자가 두 개입니다</CardTitle>
                <CardDescription>
                  Next.js 16부터 <Code>revalidateTag(tag, profile)</Code>로 프로필이 필수가
                  되었습니다. 한 개만 넘기면 deprecated 경로로 타입 에러가 납니다. 이 예제는
                  경로 단위인 <Code>revalidatePath</Code>만 씁니다.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">보안 주의</CardTitle>
              <CardDescription>
                Server Function은 이 화면의 폼을 거치지 않고 직접 POST로도 호출될 수 있습니다.
                공식 문서도 <strong>함수 안에서 인증과 인가를 검증하라</strong>고 명시합니다. 또한
                클라이언트는 Server Function을 한 번에 하나씩 순차로 보내므로, 병렬 데이터 페칭에
                쓰면 안 됩니다.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>
    </div>
  )
}
