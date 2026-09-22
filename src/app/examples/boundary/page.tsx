import { ClientStamp } from "@/components/demo/examples/client-stamp"
import { Code } from "@/components/examples/code"
import { ExamplePageHeader } from "@/components/examples/example-page-header"
import { RenderStamp } from "@/components/examples/render-stamp"
import { Section } from "@/components/examples/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata = {
  title: "Server와 Client 경계",
  description: "어느 코드가 서버에서 돌고 어느 코드가 브라우저에서 도는지 구분하는 화면",
}

const clientFiles = [
  { path: "src/components/theme-provider.tsx", reason: "next-themes의 컨텍스트" },
  { path: "src/components/mode-toggle.tsx", reason: "useTheme 훅과 클릭 핸들러" },
  { path: "src/components/demo/component-showcase.tsx", reason: "토스트와 다이얼로그 상태" },
  { path: "src/components/ui/avatar.tsx", reason: "이미지 로드 상태 추적" },
  { path: "src/components/ui/dialog.tsx", reason: "열림 상태와 포커스 트랩" },
  { path: "src/components/ui/dropdown-menu.tsx", reason: "열림 상태와 키보드 내비게이션" },
  { path: "src/components/ui/tabs.tsx", reason: "활성 탭 상태" },
  { path: "src/components/ui/tooltip.tsx", reason: "호버 지연 타이머" },
  { path: "src/components/ui/select.tsx", reason: "열림 상태와 타입어헤드" },
  { path: "src/components/ui/popover.tsx", reason: "열림 상태" },
  { path: "src/components/ui/checkbox.tsx", reason: "체크 상태" },
]

export default function BoundaryExamplePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-14">
      <ExamplePageHeader
        title="Server와 Client 경계"
        description="src/app 아래는 기본이 Server Component입니다. 상태나 브라우저 API가 필요한 지점에서만 'use client'로 경계를 내립니다. 아래 두 카드는 같은 페이지에 있지만 실행 위치가 다릅니다."
        checks={["서버 전용 값 접근", "useSyncExternalStore", "children 슬롯 주입", "하이드레이션 안전"]}
      />

      <Separator />

      <Section
        id="stamps"
        title="실행 위치 비교"
        description={
          <>
            왼쪽은 <Code>process.version</Code>을 읽습니다 — 브라우저에는 없는 값입니다. 오른쪽은{" "}
            <Code>useState</Code>와 클릭 핸들러를 씁니다. 버튼을 눌러도 왼쪽 시각은 바뀌지
            않습니다.
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">서버 컴포넌트</CardTitle>
              <CardDescription>
                브라우저 번들에 코드가 들어가지 않습니다. DB 접근이나 비밀 값 사용이 가능한
                자리입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RenderStamp />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">클라이언트 컴포넌트</CardTitle>
              <CardDescription>
                시각을 <Code>useState</Code> 초깃값으로 계산하면 서버 렌더 결과와 달라져
                하이드레이션 불일치가 납니다. 그래서 서버 스냅샷과 클라이언트 스냅샷을 따로 주는{" "}
                <Code>useSyncExternalStore</Code>로 읽습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* 클라이언트 컴포넌트의 children으로 서버 컴포넌트를 주입할 수 있습니다. */}
              <ClientStamp>
                <RenderStamp label="슬롯으로 주입된 서버 컴포넌트" />
              </ClientStamp>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Separator />

      <Section
        id="client-files"
        title={`이 프로젝트의 "use client" 파일`}
        description="인터랙션이 필요한 파일만 클라이언트 경계를 갖습니다. 나머지는 전부 서버에서 렌더됩니다."
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[55%]">파일</TableHead>
                <TableHead>클라이언트여야 하는 이유</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientFiles.map((file) => (
                <TableRow key={file.path}>
                  <TableCell className="font-mono text-[11px] break-all">{file.path}</TableCell>
                  <TableCell className="text-xs">{file.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground">
          <Code>button.tsx</Code> · <Code>badge.tsx</Code> · <Code>card.tsx</Code> ·{" "}
          <Code>table.tsx</Code> · <Code>alert.tsx</Code> · <Code>accordion.tsx</Code> 등은{" "}
          <Code>&quot;use client&quot;</Code>가 없어 서버에서 렌더됩니다. 대신 이 컴포넌트에{" "}
          <Code>onClick</Code>을 붙이는 순간 빌드가 실패하므로, 인터랙션이 있는 데모는 파일 단위로
          분리해야 합니다.
        </p>
      </Section>

      <Separator />

      <Section id="notes" title="확인할 점">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card size="sm">
            <CardHeader>
              <CardTitle>프로바이더 중첩 순서</CardTitle>
              <CardDescription>
                <Code>src/app/layout.tsx</Code>에서 <Code>ThemeProvider</Code> →{" "}
                <Code>TooltipProvider</Code> → 헤더 · main · 푸터 순서이고,{" "}
                <Code>Toaster</Code>는 <Code>TooltipProvider</Code>의 형제입니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>경계는 내려갈수록 좋습니다</CardTitle>
              <CardDescription>
                상위에서 <Code>&quot;use client&quot;</Code>를 선언하면 그 아래 전체가 클라이언트
                번들에 포함됩니다. 이 화면처럼 인터랙티브한 조각만 분리하면 번들이 작게
                유지됩니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>시각과 난수는 특히 위험합니다</CardTitle>
              <CardDescription>
                서버와 클라이언트가 서로 다른 값을 만들어 하이드레이션 불일치를 냅니다.{" "}
                <Code>suppressHydrationWarning</Code>은 <Code>html</Code> 엘리먼트에만 걸려 있어
                다른 곳의 경고는 그대로 드러납니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>타임존을 고정하세요</CardTitle>
              <CardDescription>
                <Code>src/lib/examples/timing.ts</Code>의 <Code>formatServerTime</Code>은{" "}
                <Code>Asia/Seoul</Code>로 고정해 포맷합니다. 고정하지 않으면 서버(UTC)와
                브라우저(로컬)의 문자열이 달라집니다.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>
    </div>
  )
}
