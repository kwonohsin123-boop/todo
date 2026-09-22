import Link from "next/link"
import { cn } from "cn"
import { BellIcon, CheckIcon, PlusIcon, StarIcon, Trash2Icon } from "lucide-react"

import { DisclosurePrimitives } from "@/components/demo/examples/disclosure-primitives"
import { FormPrimitives } from "@/components/demo/examples/form-primitives"
import { OverlayPrimitives } from "@/components/demo/examples/overlay-primitives"
import { RenderPropLab } from "@/components/demo/examples/render-prop-lab"
import { Code } from "@/components/examples/code"
import { ExamplePageHeader } from "@/components/examples/example-page-header"
import { Section } from "@/components/examples/section"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { badgeVariantList, buttonSizeList, buttonVariantList } from "@/lib/examples/button-matrix"

export const metadata = {
  title: "UI 프리미티브",
  description: "shadcn(Base UI) 컴포넌트를 variant와 size 조합까지 전부 렌더하는 검증 화면",
}

const sections = [
  { id: "buttons", label: "버튼" },
  { id: "badges", label: "배지" },
  { id: "forms", label: "폼" },
  { id: "overlays", label: "오버레이" },
  { id: "disclosure", label: "디스클로저" },
  { id: "display", label: "표시" },
  { id: "base-ui", label: "Base UI 패턴" },
]

const radixDifferences = [
  { radix: "asChild + 자식 엘리먼트", baseUi: "render prop (JSX 또는 함수)" },
  { radix: 'data-state="open"', baseUi: "data-open / data-closed" },
  { radix: "TooltipProvider delayDuration", baseUi: "TooltipProvider delay" },
  {
    radix: "Portal · Positioner · Content 수동 조합",
    baseUi: "Content가 세 겹을 감싸고 align · side · sideOffset만 노출",
  },
  { radix: "React.ComponentProps<typeof X>", baseUi: "DialogPrimitive.Popup.Props" },
  { radix: "—", baseUi: "모든 프리미티브에 data-slot 속성" },
]

const keyboardChecks = [
  {
    component: "Dialog",
    keys: "Tab · Shift+Tab · Esc",
    expectation: "포커스가 내부에서만 순환하고, 닫으면 트리거로 되돌아갑니다.",
  },
  {
    component: "DropdownMenu",
    keys: "↑ ↓ · Home · End · 문자 입력 · → · Esc",
    expectation: "타입어헤드로 항목을 찾고, →로 서브메뉴에 들어갑니다.",
  },
  {
    component: "Select",
    keys: "Space · 문자 입력",
    expectation: "Space로 열리고 타입어헤드로 항목을 고릅니다.",
  },
  {
    component: "RadioGroup",
    keys: "← → · Tab",
    expectation: "그룹 안에서는 방향키로 이동하고 Tab은 그룹 단위로 건너뜁니다.",
  },
  {
    component: "Accordion",
    keys: "Space · Enter · ↑ ↓",
    expectation: "트리거 간 이동과 펼치기가 모두 키보드로 됩니다.",
  },
  { component: "Tabs", keys: "← →", expectation: "방향키로 탭이 전환됩니다." },
  {
    component: "Checkbox · Switch",
    keys: "Space",
    expectation: "Space로 토글되고 상태가 data-checked에 반영됩니다.",
  },
]

export default function ComponentsExamplePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-14">
      <ExamplePageHeader
        title="UI 프리미티브"
        description="src/components/ui의 컴포넌트는 CLI가 만든 소스 파일입니다. 프리미티브가 Radix가 아니라 Base UI라서, 웹에서 흔히 보는 shadcn 예제를 그대로 붙여넣으면 동작하지 않습니다. 이 화면은 실제 API로 모든 조합을 렌더해 둔 것입니다."
        checks={["variant × size 전수", "render prop 합성", "data-* 상태", "키보드 조작"]}
      />

      <nav className="flex flex-wrap gap-1.5">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            {section.label}
          </a>
        ))}
      </nav>

      <Separator />

      <Section
        id="buttons"
        title="버튼"
        description={
          <>
            variant 6종 × size 8종 전체 조합입니다. <Code>size=&quot;default&quot;</Code>의 높이가{" "}
            <Code>h-8</Code>이라는 점에 주의하세요 — Radix 기준 예제의 <Code>h-9</Code>와
            다릅니다.
          </>
        }
      >
        <div className="space-y-5">
          {buttonSizeList.map((size) => (
            <div key={size.size} className="space-y-2">
              <p className="font-mono text-xs text-muted-foreground">{size.label}</p>
              <div className="flex flex-wrap items-center gap-2">
                {buttonVariantList.map((variant) =>
                  size.iconOnly ? (
                    <Button
                      key={variant}
                      variant={variant}
                      size={size.size}
                      aria-label={`${variant} 아이콘 버튼`}
                    >
                      <StarIcon />
                    </Button>
                  ) : (
                    <Button key={variant} variant={variant} size={size.size}>
                      {variant}
                    </Button>
                  )
                )}
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <p className="font-mono text-xs text-muted-foreground">그 외 상태와 합성</p>
            <div className="flex flex-wrap items-center gap-2">
              <Button disabled>비활성</Button>
              <Button variant="outline" disabled>
                비활성 outline
              </Button>
              <Button>
                <PlusIcon />
                아이콘 + 텍스트
              </Button>
              <Button variant="destructive">
                <Trash2Icon />
                삭제
              </Button>
              <Button aria-invalid>aria-invalid</Button>
              {/* 버튼이 아니라 링크로 이동해야 하면 컴포넌트가 아니라 클래스를 씁니다. */}
              <Link href="/examples" className={cn(buttonVariants({ variant: "secondary" }))}>
                buttonVariants()로 만든 Link
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              아이콘에 크기 클래스를 주지 않아도 <Code>size-4</Code>가 붙습니다.
              <Code>{"[&_svg:not([class*='size-'])]:size-4"}</Code> 규칙이 버튼 안에서만 적용되기
              때문입니다. xs와 icon-xs에서는 <Code>size-3</Code>으로 줄어듭니다.
            </p>
          </div>
        </div>
      </Section>

      <Separator />

      <Section
        id="badges"
        title="배지"
        description="Radix 기준 셋보다 ghost와 link 두 개가 더 있습니다."
      >
        <div className="flex flex-wrap items-center gap-2">
          {badgeVariantList.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            <CheckIcon />
            아이콘 포함
          </Badge>
          <Badge variant="outline" data-icon="inline-start">
            <BellIcon />
            data-icon=&quot;inline-start&quot;
          </Badge>
          <Badge variant="outline" data-icon="inline-end">
            data-icon=&quot;inline-end&quot;
            <BellIcon />
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          <Code>data-icon</Code>을 주면 <Code>has-data-[icon=…]</Code> 셀렉터가 아이콘 쪽 패딩을
          줄입니다. 아이콘 크기는 <Code>[&amp;&gt;svg]:size-3!</Code>로 강제됩니다.
        </p>
      </Section>

      <Separator />

      <Section
        id="forms"
        title="폼"
        description={
          <>
            <Code>Label</Code>은 순수 <Code>label</Code> 엘리먼트라 <Code>htmlFor</Code>를 직접
            연결해야 합니다. 감싸기만 하면 연결되지 않습니다.
          </>
        }
      >
        <FormPrimitives />
      </Section>

      <Separator />

      <Section
        id="overlays"
        title="오버레이"
        description={
          <>
            Dialog · Popover · DropdownMenu · Tooltip · 토스트입니다. 배치 prop을{" "}
            <Code>Positioner</Code>가 아니라 <Code>Content</Code>에 직접 넘기는 점이 Radix와 가장
            크게 다릅니다.
          </>
        }
      >
        <OverlayPrimitives />
      </Section>

      <Separator />

      <Section
        id="disclosure"
        title="디스클로저와 탭"
        description="Accordion의 value는 배열이고, 여러 개를 동시에 여는 것이 기본 동작입니다."
      >
        <DisclosurePrimitives />
      </Section>

      <Separator />

      <Section id="display" title="표시" description="아바타 · 카드 · 표 · 알림 · 스켈레톤입니다.">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-medium">아바타</p>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback>sm</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>기본</AvatarFallback>
                </Avatar>
                <Avatar size="lg">
                  <AvatarFallback>lg</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex items-center gap-2">
                <Avatar size="lg">
                  <AvatarImage src="/examples/sample.jpg" alt="샘플 이미지" />
                  <AvatarFallback>샘플</AvatarFallback>
                </Avatar>
                <Avatar size="lg">
                  {/* 존재하지 않는 경로 → 로드 실패 시 Fallback으로 전환됩니다. */}
                  <AvatarImage src="/examples/없는-파일.jpg" alt="" />
                  <AvatarFallback>실패</AvatarFallback>
                </Avatar>
                <Avatar size="lg">
                  <AvatarFallback>온</AvatarFallback>
                  <AvatarBadge className="bg-primary" />
                </Avatar>
              </div>

              <AvatarGroup>
                <Avatar>
                  <AvatarFallback>김</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>이</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>박</AvatarFallback>
                </Avatar>
                <AvatarGroupCount>+7</AvatarGroupCount>
              </AvatarGroup>
            </div>
            <p className="text-xs text-muted-foreground">
              가운데 두 번째 아바타는 없는 경로를 가리켜서 Fallback으로 전환된 상태입니다.{" "}
              <strong>
                그래서 이 화면에서는 콘솔에 404가 한 건 남습니다 — 의도된 것입니다.
              </strong>{" "}
              검증 화면들은 이 한 건 말고는 콘솔이 비어 있어야 정상입니다.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">카드 · 7개 슬롯</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>기본 크기</CardTitle>
                  <CardAction>
                    <Badge variant="secondary">CardAction</Badge>
                  </CardAction>
                  <CardDescription>
                    CardTitle에는 font-heading이 걸려 있습니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>CardContent 영역입니다.</CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline">
                    CardFooter
                  </Button>
                </CardFooter>
              </Card>
              <Card size="sm">
                <CardHeader>
                  <CardTitle>size=&quot;sm&quot;</CardTitle>
                  <CardDescription>
                    --card-spacing 변수가 줄어들어 내부 여백과 제목 크기가 함께 작아집니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>같은 구조, 좁은 여백.</CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">표</p>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Radix 기준 예제</TableHead>
                    <TableHead>이 프로젝트 (Base UI)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {radixDifferences.map((row) => (
                    <TableRow key={row.baseUi}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {row.radix}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{row.baseUi}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">알림과 구분선, 스켈레톤</p>
            <div className="space-y-3">
              <Alert>
                <BellIcon />
                <AlertTitle>기본 알림</AlertTitle>
                <AlertDescription>
                  아이콘을 첫 자식으로 두면 2열 그리드로 바뀝니다.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <Trash2Icon />
                <AlertTitle>destructive 알림</AlertTitle>
                <AlertDescription>
                  <Code>destructive-foreground</Code> 토큰이 없어서 배경을 칠하는 대신{" "}
                  <Code>text-destructive</Code>로 글자색만 바꿉니다.
                </AlertDescription>
              </Alert>
              <div className="flex items-center gap-3 text-sm">
                <span>수평</span>
                <Separator className="flex-1" />
                <span>구분선</span>
              </div>
              <div className="flex h-10 items-center gap-3 text-sm">
                <span>수직</span>
                <Separator orientation="vertical" />
                <span>구분선</span>
              </div>
              <Card>
                <CardContent className="flex items-center gap-4">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="grid gap-2">
                    <Skeleton className="h-4 w-[220px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      <Separator />

      <Section
        id="base-ui"
        title="Base UI 합성 패턴"
        description={
          <>
            <Code>render</Code> prop은 네 가지 형태로 쓸 수 있습니다. 아래에서 각각을 직접 열어
            보고, 트리거의 <Code>data-*</Code> 속성이 실시간으로 어떻게 바뀌는지 확인하세요.
          </>
        }
      >
        <RenderPropLab />

        <div className="space-y-3">
          <p className="text-sm font-medium">키보드 조작 체크리스트</p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">컴포넌트</TableHead>
                  <TableHead className="w-56">키</TableHead>
                  <TableHead>기대 동작</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keyboardChecks.map((check) => (
                  <TableRow key={check.component}>
                    <TableCell className="text-xs font-medium">{check.component}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {check.keys}
                    </TableCell>
                    <TableCell className="text-xs">{check.expectation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Section>
    </div>
  )
}
