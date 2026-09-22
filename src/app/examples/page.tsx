import Link from "next/link"
import { CheckIcon, TerminalIcon } from "lucide-react"

import { Code } from "@/components/examples/code"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { exampleEntries, exampleGroups } from "@/lib/examples/examples-nav"

export const metadata = {
  title: "예제",
  description: "이 스타터 킷의 기술 스택이 실제로 동작하는지 확인하는 검증 화면 모음",
}

const verifyCommands = [
  { command: "npm run build", note: "새 라우트의 전역 타입을 생성하고 프로덕션 빌드를 만듭니다." },
  { command: "npm run lint", note: "next build는 린트를 돌리지 않으므로 따로 실행합니다." },
  { command: "npx tsc --noEmit", note: "전용 스크립트가 없어 직접 실행합니다." },
  { command: "npm run start", note: "캐시와 revalidate 동작은 프로덕션에서만 구분됩니다." },
]

export default function ExamplesIndexPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-14">
      <section className="space-y-4">
        <Badge variant="secondary">스택 검증</Badge>
        <h1 className="text-4xl font-bold tracking-tight">예제 화면</h1>
        <p className="max-w-3xl text-lg text-muted-foreground">
          이 스타터 킷의 조합은 깨져도 화면이 그럴싸하게 보이는 지점이 많습니다. Tailwind v4는
          토큰 한 군데만 빠져도 빌드 에러 없이 색이 안 바뀌고, 폰트 배선이 끊어져도 fallback으로
          렌더되며, Next.js 16은 예전 예제 코드와 시그니처가 달라졌습니다. 아래 화면들은 그런
          실패를 눈으로 잡아내기 위한 것입니다.
        </p>
      </section>

      {exampleGroups.map((group) => {
        const entries = exampleEntries.filter((entry) => entry.group === group.id)

        return (
          <section key={group.id} className="space-y-4">
            <Separator />
            <div className="space-y-1.5">
              <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                <group.icon className="size-5 text-muted-foreground" />
                {group.title}
              </h2>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {entries.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Card className="h-full transition-colors group-hover:bg-accent/40">
                    <CardHeader>
                      <entry.icon className="size-5 text-muted-foreground" />
                      <CardTitle>{entry.title}</CardTitle>
                      <CardAction>
                        <Badge variant="secondary">검증 {entry.checks.length}</Badge>
                      </CardAction>
                      <CardDescription>{entry.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {entry.checks.map((check) => (
                          <li
                            key={check}
                            className="flex gap-1.5 text-xs text-muted-foreground"
                          >
                            <CheckIcon className="mt-0.5 size-3 shrink-0" />
                            {check}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )
      })}

      <Separator />

      <section className="space-y-4">
        <div className="space-y-1.5">
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <TerminalIcon className="size-5 text-muted-foreground" />
            검증 명령
          </h2>
          <p className="text-sm text-muted-foreground">
            테스트 프레임워크가 설치되어 있지 않으므로, 변경 검증은 아래 네 가지로 합니다.
          </p>
        </div>

        <Card>
          <CardContent className="space-y-2.5">
            {verifyCommands.map((item) => (
              <div key={item.command} className="space-y-0.5">
                <Code className="text-xs">{item.command}</Code>
                <p className="text-xs text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          새 라우트를 추가한 직후에는 <Code>PageProps</Code>나 <Code>RouteContext</Code> 전역
          타입이 아직 없으므로, <Code>npm run build</Code>를 한 번 돌린 뒤에 타입 체크를 해야
          합니다.
        </p>
      </section>
    </div>
  )
}
