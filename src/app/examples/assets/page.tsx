import Image from "next/image"
import Link from "next/link"
import { cn } from "cn"
import { BellIcon, HeartIcon, SparklesIcon, StarIcon, TriangleAlertIcon } from "lucide-react"

import samplePhoto from "../../../../public/examples/sample.jpg"

import { ComputedFontReadout } from "@/components/demo/examples/computed-font-readout"
import { ImageAttrReadout } from "@/components/demo/examples/image-attr-readout"
import { Code } from "@/components/examples/code"
import { ExamplePageHeader } from "@/components/examples/example-page-header"
import { Section } from "@/components/examples/section"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
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
  title: "폰트 · 아이콘 · 이미지",
  description: "Pretendard 변수 배선과 lucide 아이콘, next/image 최적화 경로를 실측하는 화면",
}

const fontWiring = [
  {
    utility: "font-sans",
    themeVar: "--font-sans",
    source: 'localFont({ src: "../fonts/PretendardVariable.woff2", variable: "--font-sans" })',
    className: "font-sans",
    note: "한글 글리프를 담기 위해 Geist 대신 Pretendard Variable을 next/font/local로 로드합니다. 변수명이 --font-sans인 것은 shadcn이 생성한 @theme inline이 이 이름을 참조하기 때문입니다. 이름을 바꾸면 빌드 에러 없이 폰트만 사라집니다.",
  },
  {
    utility: "font-mono",
    themeVar: "--font-geist-mono",
    source: 'Geist_Mono({ variable: "--font-geist-mono" })',
    className: "font-mono",
    note: "sans와 달리 이름이 그대로 남아 있어 변수 이름이 비대칭입니다.",
  },
  {
    utility: "font-heading",
    themeVar: "--font-sans",
    source: "sans의 별칭",
    className: "font-heading",
    note: "현재는 sans와 같은 변수를 가리키므로 font-sans와 똑같이 보이는 것이 정상입니다. CardTitle이 이미 사용 중이라, 제목 폰트를 따로 쓰려면 이 변수만 바꾸면 됩니다.",
  },
]

const iconSizes = ["size-3", "size-3.5", "size-4", "size-5", "size-6", "size-8", "size-10"]

const typeScale = [
  { className: "text-xs", label: "text-xs · 0.75rem" },
  { className: "text-sm", label: "text-sm · 0.875rem" },
  { className: "text-base", label: "text-base · 1rem" },
  { className: "text-lg", label: "text-lg · 1.125rem" },
  { className: "text-xl", label: "text-xl · 1.25rem" },
  { className: "text-2xl", label: "text-2xl · 1.5rem" },
  { className: "text-3xl", label: "text-3xl · 1.875rem" },
  { className: "text-4xl", label: "text-4xl · 2.25rem" },
  { className: "text-5xl", label: "text-5xl · 3rem" },
]

const numberRows = [
  { label: "요청 수", value: "1,024,512" },
  { label: "평균 응답", value: "118.4 ms" },
  { label: "오류율", value: "0.037 %" },
]

export default function AssetsExamplePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-14">
      <ExamplePageHeader
        title="폰트 · 아이콘 · 이미지"
        description="폰트 변수 배선과 이미지 최적화는 끊어져도 화면이 그럴싸하게 보이기 때문에 육안으로는 잡히지 않습니다. 이 화면은 브라우저가 실제로 적용한 값과 내려받은 URL을 직접 읽어서 보여줍니다."
        checks={["font-family 실측", "lucide 크기와 색 상속", "next/image srcset", "SVG 최적화 우회"]}
      />

      <Separator />

      <Section
        id="fonts"
        title="폰트 변수 배선"
        description={
          <>
            <Code>next/font</Code>가 만든 CSS 변수와 <Code>@theme inline</Code>의 참조 이름이
            맞아야 폰트가 적용됩니다. 아래 각 행의 두 번째 줄은{" "}
            <Code>getComputedStyle</Code>로 읽은 실제 값입니다.
          </>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">유틸리티</TableHead>
                <TableHead className="w-44">@theme inline 참조</TableHead>
                <TableHead>적용 결과</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fontWiring.map((row) => (
                <TableRow key={row.utility}>
                  <TableCell className="align-top">
                    <p className="font-mono text-xs">{row.utility}</p>
                  </TableCell>
                  <TableCell className="align-top">
                    <p className="font-mono text-xs">{row.themeVar}</p>
                    <p className="mt-1 font-mono text-[10px] break-all text-muted-foreground">
                      {row.source}
                    </p>
                  </TableCell>
                  <TableCell className="align-top">
                    <ComputedFontReadout className={row.className} />
                    <p className="mt-1.5 max-w-md text-[11px] leading-snug text-muted-foreground">
                      {row.note}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Alert>
          <TriangleAlertIcon />
          <AlertTitle>결과에 Pretendard가 없으면 배선이 끊어진 것입니다</AlertTitle>
          <AlertDescription>
            <Code>src/app/layout.tsx</Code>의 <Code>variable</Code> 값을 <Code>--font-sans</Code>{" "}
            이외의 이름으로 바꾸면, <Code>html {"{ @apply font-sans }"}</Code>가 정의되지 않은
            변수를 가리켜 Pretendard가 적용되지 않습니다. 그래도 fallback 폰트로 렌더되니 화면은
            멀쩡해 보이고, 한글만 시스템 폰트로 떨어집니다.
          </AlertDescription>
        </Alert>
      </Section>

      <Separator />

      <Section id="type-scale" title="타입 스케일" description="크기와 자간, 숫자 정렬입니다.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1.5">
            {typeScale.map((step) => (
              <div key={step.className} className="flex items-baseline gap-3">
                <span className={cn("font-semibold", step.className)}>다람쥐 Aa</span>
                <span className="font-mono text-[10px] text-muted-foreground">{step.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">자간</CardTitle>
                <CardDescription>
                  제목에는 <Code>tracking-tight</Code>를 쓰는 것이 이 프로젝트의 관례입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-2xl font-bold tracking-tighter">tracking-tighter 제목</p>
                <p className="text-2xl font-bold tracking-tight">tracking-tight 제목</p>
                <p className="text-2xl font-bold">기본 자간 제목</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">숫자 정렬</CardTitle>
                <CardDescription>
                  왼쪽은 <Code>font-sans</Code>, 오른쪽은 <Code>font-mono tabular-nums</Code>{" "}
                  입니다. 자리가 맞는지 비교해 보세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  {numberRows.map((row) => (
                    <div key={row.label} className="flex justify-between gap-2">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 font-mono tabular-nums">
                  {numberRows.map((row) => (
                    <div key={row.label} className="flex justify-between gap-2">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span>{row.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      <Separator />

      <Section
        id="icons"
        title="lucide 아이콘"
        description={
          <>
            이름으로 임포트하므로 사용한 아이콘만 번들에 들어갑니다. 전체 목록은{" "}
            <Link href="/icons" className="underline underline-offset-4">
              아이콘 화면
            </Link>
            에 있습니다.
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">크기</CardTitle>
              <CardDescription>
                SVG 기본값은 24px이고, Tailwind의 <Code>size-*</Code>로 덮어씁니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-end gap-4">
              {iconSizes.map((size) => (
                <div key={size} className="flex flex-col items-center gap-1">
                  <StarIcon className={size} />
                  <span className="font-mono text-[10px] text-muted-foreground">{size}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">색 상속</CardTitle>
              <CardDescription>
                <Code>stroke=&quot;currentColor&quot;</Code>이므로 아이콘에 색 클래스를 주지 않고
                부모의 <Code>text-*</Code>만 바꿔도 따라옵니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              {[
                { className: "text-foreground", label: "foreground" },
                { className: "text-muted-foreground", label: "muted" },
                { className: "text-primary", label: "primary" },
                { className: "text-destructive", label: "destructive" },
              ].map((item) => (
                <div key={item.label} className={cn("flex flex-col items-center gap-1", item.className)}>
                  <HeartIcon className="size-6" />
                  <span className="font-mono text-[10px]">{item.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">선 두께</CardTitle>
              <CardDescription>
                <Code>strokeWidth</Code>는 prop으로 넘깁니다. 기본값은 2입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              {[1, 1.5, 2, 2.5].map((width) => (
                <div key={width} className="flex flex-col items-center gap-1">
                  <SparklesIcon className="size-7" strokeWidth={width} />
                  <span className="font-mono text-[10px] text-muted-foreground">{width}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">컨테이너 자동 규칙</CardTitle>
              <CardDescription>
                아이콘에 크기를 주지 않아도 컨테이너가 맞춰 줍니다. 크기 클래스가 이미 있으면
                건드리지 않습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">
                  <BellIcon />
                  sm → size-3.5
                </Button>
                <Button>
                  <BellIcon />
                  default → size-4
                </Button>
                <Badge variant="outline">
                  <BellIcon />
                  Badge → size-3
                </Badge>
              </div>
              <p className="font-mono text-[10px] break-all text-muted-foreground">
                {"[&_svg:not([class*='size-'])]:size-4"} · {"[&>svg]:size-3!"}
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Separator />

      <Section
        id="images"
        title="next/image"
        description={
          <>
            <Code>next.config.ts</Code>에 <Code>remotePatterns</Code> 설정이 없으므로 외부 URL은
            쓸 수 없습니다. 아래는 모두 <Code>public/</Code>의 로컬 에셋입니다.
          </>
        }
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                래스터 · 정적 import + placeholder=&quot;blur&quot;
              </CardTitle>
              <CardDescription>
                정적 import는 width와 height가 자동으로 추론되고 blurDataURL까지 빌드 시점에
                생성됩니다. <Code>currentSrc</Code>가 <Code>/_next/image?…</Code> 로 시작하고
                srcSet 후보가 여러 개 잡혀야 최적화가 살아 있는 것입니다. 이미지는 지연
                로딩이므로 화면에 들어온 뒤에 값이 채워집니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <ImageAttrReadout>
                <Image
                  src={samplePhoto}
                  alt="그라디언트 샘플 이미지"
                  placeholder="blur"
                  sizes="(min-width: 768px) 24rem, 100vw"
                  className="rounded-lg"
                />
              </ImageAttrReadout>

              <div className="space-y-2">
                <ImageAttrReadout>
                  <Image
                    src={samplePhoto}
                    alt="quality를 20으로 지정한 같은 이미지"
                    quality={20}
                    sizes="(min-width: 768px) 24rem, 100vw"
                    className="rounded-lg"
                  />
                </ImageAttrReadout>
                <p className="text-xs text-muted-foreground">
                  이 이미지에는 <Code>quality=&#123;20&#125;</Code>을 줬고{" "}
                  <Code>currentSrc</Code>에도 <Code>q=20</Code>이 실려 나갑니다. 왼쪽 이미지와
                  파일 크기를 비교해 보세요. 단 이건 <Code>next.config.ts</Code>의{" "}
                  <Code>images.qualities</Code>에 20을 <strong>등록해 둔 덕분</strong>입니다 —
                  등록하지 않으면 아래 경고처럼 조용히 75로 처리됩니다.
                </p>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <TriangleAlertIcon />
            <AlertTitle>quality 값은 allowlist에 등록해야 적용됩니다</AlertTitle>
            <AlertDescription>
              <p>
                악의적인 요청으로 의도보다 많은 변환을 유발하는 것을 막기 위해 Next.js 16부터{" "}
                <Code>qualities</Code>가 제한 목록이 되었습니다. 기본값은{" "}
                <Code>[75]</Code> 하나뿐이고, 목록에 없는 값은 dev에서 콘솔 경고를 남기며
                프로덕션에서는 조용히 75로 처리됩니다. 위 데모가 실제로 동작하도록 이
                프로젝트는 아래처럼 등록해 두었습니다.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed text-foreground">
                {`// next.config.ts
images: {
  qualities: [20, 50, 75, 90],
}`}
              </pre>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">fill + object-cover</CardTitle>
              <CardDescription>
                <Code>fill</Code>을 쓰면 부모에 <Code>relative</Code>와 높이가 반드시 있어야
                하고, <Code>sizes</Code>가 없으면 콘솔 경고가 납니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageAttrReadout>
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg">
                  <Image
                    src={samplePhoto}
                    alt="영역을 채운 샘플 이미지"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 64rem, 100vw"
                  />
                </div>
              </ImageAttrReadout>
            </CardContent>
          </Card>

          <Card>
            {/* Card의 첫 자식이 img면 위쪽 패딩이 사라지고 모서리가 둥글어집니다. */}
            <Image
              src={samplePhoto}
              alt="카드 상단 미디어"
              placeholder="blur"
              sizes="(min-width: 640px) 40rem, 100vw"
            />
            <CardHeader>
              <CardTitle className="text-base">카드 첫 자식으로 넣은 이미지</CardTitle>
              <CardDescription>
                <Code>{"has-[>img:first-child]:pt-0"}</Code>와{" "}
                <Code>{"*:[img:first-child]:rounded-t-xl"}</Code> 규칙이 걸려 있어, 이미지를 첫
                자식으로 두면 별도 클래스 없이 미디어 카드가 됩니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">SVG는 최적화를 우회합니다</CardTitle>
              <CardDescription>
                기본 로더는 <Code>dangerouslyAllowSVG</Code>가 꺼져 있으면 <Code>.svg</Code>를
                최적화 파이프라인에 넣지 않고 원본 경로로 그대로 내보냅니다. 에러는 나지 않지만
                srcSet도 blur도 생기지 않습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <ImageAttrReadout>
                {/*
                  width/height는 반드시 원본의 종횡비와 같아야 합니다.
                  next.svg의 viewBox는 0 0 394 80(비율 4.925)인데 240x48(비율 5.0)로
                  선언했더니, Tailwind preflight의 img { height: auto }가 실제 비율로
                  48.73px를 계산해 렌더 높이만 49가 되었습니다. 그러면 width는 그대로고
                  height만 달라져 Next.js가 종횡비 경고를 냅니다.
                  화면 크기는 CSS(w-60)로 줄이고, 속성에는 원본 크기를 그대로 둡니다.
                */}
                <Image
                  src="/next.svg"
                  alt="Next.js 로고"
                  width={394}
                  height={80}
                  className="h-auto w-60 dark:invert"
                />
              </ImageAttrReadout>

              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  왼쪽 readout의 <Code>srcSet</Code>이 &ldquo;없음&rdquo;이고{" "}
                  <Code>currentSrc</Code>가 <Code>/next.svg</Code> 그대로인지 확인하세요. 반대로{" "}
                  <Code>/_next/image?url=/next.svg</Code> 를 직접 열면 400이 돌아옵니다.
                </p>
                <p className="text-muted-foreground">
                  SVG를 최적화 대상으로 넣고 싶다면 아래 설정이 필요합니다. 다만 신뢰할 수 없는
                  SVG를 서빙하면 스크립트가 실행될 수 있어 이 스타터 킷의 기본값으로는 넣지
                  않았습니다.
                </p>
                <pre className="overflow-x-auto rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed">
                  {`// next.config.ts
images: {
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'",
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <TriangleAlertIcon />
            <AlertTitle>priority는 Next.js 16에서 deprecated입니다</AlertTitle>
            <AlertDescription>
              <p>
                <Code>preload</Code>로 대체되었습니다. 다만 공식 문서는 대부분의 경우{" "}
                <Code>preload</Code>보다 <Code>loading=&quot;eager&quot;</Code> 또는{" "}
                <Code>fetchPriority=&quot;high&quot;</Code>를 쓰라고 권합니다.{" "}
                <Code>preload</Code>는 언제 <strong>내려받을지</strong>만 제어하고 언제 그릴지는
                제어하지 않습니다.
              </p>
              <p className="mt-2">
                <Code>qualities</Code> 기본값도 <Code>[75]</Code>로 바뀌었고,{" "}
                <Code>images.domains</Code>는 <Code>remotePatterns</Code>로 대체되었습니다.
              </p>
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/examples"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              예제 목록으로
            </Link>
            <a
              href="/_next/image?url=%2Fnext.svg&w=256&q=75"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              SVG를 최적화 엔드포인트로 직접 요청해 보기 (400)
            </a>
          </div>
        </div>
      </Section>
    </div>
  )
}
