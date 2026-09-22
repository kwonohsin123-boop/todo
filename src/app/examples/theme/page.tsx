import { cn } from "cn"
import { TriangleAlertIcon } from "lucide-react"

import { TokenValueTable } from "@/components/demo/examples/token-value-table"
import { Code } from "@/components/examples/code"
import { ExamplePageHeader } from "@/components/examples/example-page-header"
import { Section } from "@/components/examples/section"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import {
  colorTokenGroups,
  colorTokenVars,
  dataVariants,
  radiusScale,
  shimmerDemos,
  type ColorPair,
} from "@/lib/examples/tokens"

export const metadata = {
  title: "테마와 다크 모드",
  description: "Tailwind CSS 4의 색 토큰과 다크 모드가 실제로 동작하는지 실측하는 화면",
}

/** 배경 위에 짝 전경색으로 샘플 글자를 올려, 쌍이 실제로 읽히는지 확인합니다. */
function TokenTile({ pair }: { pair: ColorPair }) {
  return (
    <div className="space-y-1.5">
      <div className="overflow-hidden rounded-lg ring-1 ring-foreground/10">
        <div className={cn("flex h-16 items-center justify-center text-sm", pair.bgClass)}>
          {pair.fgName ? "Aa 가나" : null}
        </div>
        {pair.fgClass ? (
          <div className={cn("flex h-10 items-center justify-center text-xs", pair.fgClass)}>
            Aa 가나
          </div>
        ) : null}
      </div>
      <div className="space-y-0.5">
        <p className="font-mono text-xs">bg-{pair.bgName}</p>
        {pair.fgName ? (
          <p className="font-mono text-[11px] text-muted-foreground">
            text-{pair.fgName}
          </p>
        ) : null}
        {pair.note ? (
          <p className="text-[11px] leading-snug text-muted-foreground">{pair.note}</p>
        ) : null}
      </div>
    </div>
  )
}

function PaletteGrid() {
  return (
    <div className="space-y-8">
      {colorTokenGroups.map((group) => (
        <div key={group.id} className="space-y-3">
          <div className="space-y-0.5">
            <h3 className="font-heading text-sm font-semibold">{group.title}</h3>
            <p className="text-xs text-muted-foreground">{group.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {group.pairs.map((pair) => (
              <TokenTile key={pair.bgName} pair={pair} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ThemeExamplePage() {
  const chartPairs = colorTokenGroups.find((group) => group.id === "chart")?.pairs ?? []

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-14">
      <ExamplePageHeader
        title="테마와 다크 모드"
        description="Tailwind CSS 4에는 설정 파일이 없고 테마가 globals.css 한 곳에 있습니다. 색 토큰은 :root · .dark · @theme inline 세 군데가 모두 맞아야 동작하는데, 하나라도 빠지면 빌드 에러 없이 조용히 실패합니다. 이 화면은 그 실패를 눈으로 잡아내기 위한 것입니다."
        checks={[
          "색 토큰 팔레트",
          "라이트와 다크 값 실측 비교",
          "radius 스케일",
          "숨은 커스텀 유틸리티",
          "data-* 변형",
        ]}
      />

      <Separator />

      <Section
        id="overview"
        title="구성"
        description={
          <>
            <Code>src/app/globals.css</Code> 한 파일이 테마 전부입니다.{" "}
            <Code>tailwind.config</Code> 파일은 없습니다.
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">세 개의 import</CardTitle>
              <CardDescription>
                <Code>tailwindcss</Code>, <Code>tw-animate-css</Code>,{" "}
                <Code>shadcn/tailwind.css</Code>. 마지막 것이 아래 &ldquo;숨은 유틸리티&rdquo;
                섹션의 기능을 전부 들여옵니다.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">다크 변형 정의</CardTitle>
              <CardDescription>
                <Code>{"@custom-variant dark (&:is(.dark *));"}</Code> 이 한 줄이 v3의{" "}
                <Code>darkMode: &quot;class&quot;</Code> 설정 키를 대체합니다. 이 줄이 없으면 모든{" "}
                <Code>dark:</Code> 유틸리티가 아무것도 만들지 않습니다.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">토큰과 유틸리티 연결</CardTitle>
              <CardDescription>
                <Code>{"@theme inline { --color-card: var(--card); }"}</Code>. <Code>inline</Code>{" "}
                키워드가 핵심인데, 값을 리터럴로 굽지 않고 <Code>var()</Code> 참조로 내보내기
                때문에 <Code>.dark</Code>의 덮어쓰기가 런타임에 전파됩니다.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">확인 방법</CardTitle>
              <CardDescription>
                헤더 오른쪽 테마 토글로 라이트와 다크를 전환해 보세요. 아래 팔레트가 바뀌어야
                정상입니다. 색이 그대로라면 <Code>.dark</Code> 토큰 세트가 빠진 것입니다.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Separator />

      <Section
        id="palette"
        title="색 토큰 팔레트"
        description={
          <>
            각 타일의 위쪽은 배경 토큰, 아래쪽은 짝이 되는 전경 토큰을 배경으로 뒤집어 본
            것입니다. 클래스 이름은 모두 소스에 리터럴로 적혀 있습니다 — Tailwind v4는 정적
            스캔이라 <Code>{"`bg-${name}`"}</Code> 처럼 조립한 클래스는 만들어지지 않습니다.
          </>
        }
      >
        <PaletteGrid />
      </Section>

      <Separator />

      <Section
        id="values"
        title="라이트와 다크 값 실측"
        description={
          <>
            화면 밖에 <Code>.dark</Code> 클래스를 가진 프로브 엘리먼트를 두고{" "}
            <Code>getComputedStyle</Code>로 읽습니다. 그래서 테마를 바꾸지 않고도 양쪽 값을 한
            번에 비교할 수 있습니다. 두 값이 같으면 <Code>.dark</Code>에 해당 토큰이 빠졌다는
            신호입니다.
          </>
        }
      >
        <TokenValueTable vars={colorTokenVars} />
      </Section>

      <Separator />

      <Section
        id="scoped-dark"
        title="영역 단위 다크 모드"
        description="같은 팔레트를 라이트와 다크로 나란히 렌더합니다. 여기에는 의도적으로 넣어 둔 실패 예시가 하나 있습니다."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3 rounded-xl border p-4">
            <p className="text-xs font-medium text-muted-foreground">현재 테마</p>
            <div className="flex gap-2">
              <div className="h-12 flex-1 rounded-lg bg-background ring-1 ring-foreground/10" />
              <div className="h-12 flex-1 rounded-lg bg-card ring-1 ring-foreground/10" />
              <div className="h-12 flex-1 rounded-lg bg-primary" />
              <div className="h-12 flex-1 rounded-lg bg-muted" />
            </div>
          </div>

          <div className="dark space-y-3 rounded-xl border bg-background p-4 text-foreground">
            <p className="text-xs font-medium text-muted-foreground">
              강제 다크 (<Code>className=&quot;dark&quot;</Code>)
            </p>
            <div className="flex gap-2">
              <div className="h-12 flex-1 rounded-lg bg-background ring-1 ring-foreground/10" />
              <div className="h-12 flex-1 rounded-lg bg-card ring-1 ring-foreground/10" />
              <div className="h-12 flex-1 rounded-lg bg-primary" />
              <div className="h-12 flex-1 rounded-lg bg-muted" />
            </div>
          </div>
        </div>

        <Alert>
          <TriangleAlertIcon />
          <AlertTitle>실패 예시: 컨테이너 자신에게는 dark: 변형이 걸리지 않습니다</AlertTitle>
          <AlertDescription>
            <p>
              변수 재선언은 컨테이너 자체에도 적용되지만, <Code>dark:</Code> 접두 변형의 셀렉터는{" "}
              <Code>{"&:is(.dark *)"}</Code> — 즉 <strong>후손</strong>만 매칭합니다. 아래 두 박스는
              똑같이 <Code>dark:bg-primary</Code>를 갖고 있는데, <Code>dark</Code> 클래스를 자기
              자신에 가진 왼쪽은 색이 바뀌지 않습니다.
            </p>
            <div className="mt-3 flex gap-3">
              <div className="dark flex h-14 flex-1 items-center justify-center rounded-lg border bg-muted text-xs dark:bg-primary">
                자기 자신이 .dark → 안 바뀜
              </div>
              <div className="dark flex-1 rounded-lg border p-1">
                <div className="flex h-12 items-center justify-center rounded-md bg-muted text-xs dark:bg-primary dark:text-primary-foreground">
                  .dark의 후손 → 바뀜
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </Section>

      <Separator />

      <Section
        id="chart"
        title="차트 토큰"
        description="chart-1부터 chart-5까지를 인접해서 렌더합니다."
      >
        <div className="flex h-32 items-end gap-2">
          {chartPairs.map((pair, index) => (
            <div key={pair.bgName} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={cn("w-full rounded-t-md", pair.bgClass)}
                style={{ height: `${40 + index * 14}%` }}
              />
              <span className="font-mono text-[10px] text-muted-foreground">
                {pair.bgName}
              </span>
            </div>
          ))}
        </div>

        <Alert>
          <TriangleAlertIcon />
          <AlertTitle>차트 5색은 PRD §9.2에서 확정했습니다</AlertTitle>
          <AlertDescription>
            <p>
              스타터 킷 기본값은 <Code>components.json</Code>의 <Code>baseColor</Code>가{" "}
              <Code>neutral</Code>이라 다섯 색이 전부 무채색이고 라이트와 다크 값까지 같았습니다.
              지금은 명도대 · 채도 하한 · 색각이상 분리도 · 배경 대비 검사를 통과한 5색으로
              교체되어 있습니다. 구현할 때 두 가지를 지키세요. ① <strong>한 차트의 계열은
              3개까지</strong> — 4번째부터 yellow와 orange가 한 화면에 올라와 전 조합 기준을
              통과하지 못합니다. ② <strong>라이트 모드 차트에는 직접 라벨이나 표 보기를 반드시
              함께</strong> 둡니다 — aqua · yellow · magenta가 배경 대비 3:1 미만이라 식별을 색에만
              맡길 수 없습니다.
            </p>
            <p className="mt-2">
              토큰 하나를 새로 만들 때는 여전히 <strong>세 군데를 함께</strong> 고쳐야 합니다.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed text-foreground">
              {`:root  { --chart-1: oklch(0.65 0.2 250); }  /* 1. 라이트 값 */
.dark  { --chart-1: oklch(0.7 0.18 250); }   /* 2. 다크 값 */
@theme inline { --color-chart-1: var(--chart-1); } /* 3. 유틸리티 생성 */`}
            </pre>
            <p className="mt-2">
              3번이 빠지면 <Code>bg-chart-1</Code> 클래스 자체가 만들어지지 않고, 2번이 빠지면
              다크에서 색이 바뀌지 않습니다. 둘 다 빌드 에러 없이 실패합니다.
            </p>
          </AlertDescription>
        </Alert>
      </Section>

      <Separator />

      <Section
        id="radius"
        title="radius 스케일"
        description={
          <>
            <Code>--radius: 0.375rem</Code> 하나를 기준으로 배수를 만듭니다.
          </>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">미리보기</TableHead>
                <TableHead>클래스</TableHead>
                <TableHead>계산식</TableHead>
                <TableHead className="text-right">결과</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {radiusScale.map((step) => (
                <TableRow key={step.className}>
                  <TableCell>
                    <div
                      className={cn(
                        "size-12 bg-muted ring-1 ring-foreground/10",
                        step.previewClass
                      )}
                    />
                  </TableCell>
                  <TableCell className="align-middle">
                    <p className="font-mono text-xs">{step.className}</p>
                    {step.note ? (
                      <p className="mt-1 max-w-xs text-[11px] leading-snug text-destructive">
                        {step.note}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {step.formula}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {step.computed}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Separator />

      <Section
        id="utilities"
        title="숨은 커스텀 유틸리티"
        description={
          <>
            <Code>@import &quot;shadcn/tailwind.css&quot;</Code>가 문서에 잘 드러나지 않는 유틸리티를
            함께 들여옵니다. 아래는 그중 바로 쓸 수 있는 것들입니다.
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">shimmer</CardTitle>
              <CardDescription>
                <Code>background-clip: text</Code>이므로 <strong>텍스트에만</strong> 적용됩니다. 빈
                div에 걸면 아무 일도 일어나지 않습니다. <Code>prefers-reduced-motion</Code>에서는
                자동으로 멈춥니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {shimmerDemos.map((demo) => (
                <div key={demo.label} className="space-y-0.5">
                  <p className={cn("text-lg font-semibold", demo.className)}>
                    스타터 킷 검증 중
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {demo.label} — {demo.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">no-scrollbar</CardTitle>
                <CardDescription>
                  스크롤은 되지만 스크롤바만 감춥니다. 왼쪽이 기본, 오른쪽이 적용 후입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div className="h-24 overflow-y-auto rounded-lg border p-2 text-xs">
                  {Array.from({ length: 12 }, (_, i) => (
                    <p key={i}>기본 스크롤바 {i + 1}</p>
                  ))}
                </div>
                <div className="no-scrollbar h-24 overflow-y-auto rounded-lg border p-2 text-xs">
                  {Array.from({ length: 12 }, (_, i) => (
                    <p key={i}>no-scrollbar {i + 1}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">scroll-fade-y</CardTitle>
                <CardDescription>
                  스크롤 가능한 방향에만 마스크로 페이드를 겁니다. 맨 위에서는 아래쪽만 흐려집니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="scroll-fade-y h-28 overflow-y-auto rounded-lg border p-2 text-xs">
                  {Array.from({ length: 16 }, (_, i) => (
                    <p key={i}>스크롤해 보세요 {i + 1}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">tw-animate-css</CardTitle>
                <CardDescription>
                  <Code>animate-in</Code> 계열. 페이지가 로드될 때 한 번 재생됩니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="animate-in rounded-lg border bg-muted p-3 text-xs duration-700 fade-in slide-in-from-bottom-4">
                  animate-in fade-in slide-in-from-bottom-4 duration-700
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      <Separator />

      <Section
        id="data-variants"
        title="data-* 변형"
        description={
          <>
            Radix의 <Code>data-state</Code>와 Base UI의 <Code>data-open</Code> 같은 불리언 속성을
            양쪽 다 매칭하도록 정의되어 있습니다. 덕분에 웹의 Radix 예제에 있던 스타일 코드가
            대체로 그대로 동작합니다.
          </>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">변형</TableHead>
                <TableHead>셀렉터</TableHead>
                <TableHead>이 프로젝트의 사용처</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataVariants.map((variant) => (
                <TableRow key={variant.name}>
                  <TableCell className="font-mono text-xs">{variant.name}</TableCell>
                  <TableCell className="font-mono text-[11px] break-all text-muted-foreground">
                    {variant.selector}
                  </TableCell>
                  <TableCell className="text-xs">{variant.consumer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              data-open과 accordion 키프레임 동작 확인
            </CardTitle>
            <CardDescription>
              아코디언을 펼치면 <Code>data-open:animate-accordion-down</Code>이 걸립니다. 이
              키프레임은 <Code>shadcn/tailwind.css</Code>에만 정의되어 있고, 프로젝트 전체에서
              아코디언이 유일한 소비자입니다. 높이 애니메이션이 보이면 변형과 키프레임이 모두
              살아 있다는 뜻입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion>
              <AccordionItem value="down">
                <AccordionTrigger>펼칠 때 animate-accordion-down</AccordionTrigger>
                <AccordionContent>
                  패널 높이는 <Code>--accordion-panel-height</Code> CSS 변수로 계산되고, 시작과
                  끝 상태는 <Code>data-starting-style</Code> · <Code>data-ending-style</Code>로
                  잡습니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="up">
                <AccordionTrigger>접을 때 animate-accordion-up</AccordionTrigger>
                <AccordionContent>
                  Base UI 아코디언은 기본적으로 여러 항목을 동시에 열 수 있습니다. 하나만
                  열리게 하려면 <Code>multiple={"{false}"}</Code>를 주세요.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </Section>
    </div>
  )
}
