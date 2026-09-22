import Link from "next/link"
import { cn } from "cn"
import { ChevronRightIcon } from "lucide-react"

import { Code } from "@/components/examples/code"
import { ExamplePageHeader } from "@/components/examples/example-page-header"
import { Section } from "@/components/examples/section"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { POSTS } from "@/lib/examples/posts"

export const metadata = {
  title: "동적 라우트",
  description: "[slug] 세그먼트와 generateMetadata, notFound를 검증하는 화면",
}

export default function PostsExamplePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-14">
      <ExamplePageHeader
        title="동적 라우트와 메타데이터"
        description="[slug] 폴더가 동적 세그먼트가 됩니다. params는 Promise이므로 await해야 하고, generateStaticParams로 빌드 시점에 프리렌더할 목록을 알려 줄 수 있습니다. 존재하지 않는 slug로 들어가면 notFound()가 not-found.tsx를 렌더합니다."
        checks={["params는 Promise", "generateStaticParams", "generateMetadata", "notFound()"]}
      />

      <Separator />

      <Section
        id="list"
        title="글 목록"
        description={
          <>
            여섯 개 slug는 <Code>generateStaticParams</Code>가 반환하므로 빌드 시점에 정적
            페이지로 만들어집니다. 각 페이지로 들어가면 브라우저 탭 제목이 글 제목으로 바뀌는지
            확인해 보세요.
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/examples/posts/${post.slug}`} className="group block">
              <Card className="h-full transition-colors group-hover:bg-accent/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-1.5">
                    {post.title}
                    <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">{post.tag}</Badge>
                  </CardAction>
                  <CardDescription>{post.summary}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Separator />

      <Section
        id="not-found"
        title="존재하지 않는 slug"
        description={
          <>
            <Code>getPost()</Code>가 <Code>undefined</Code>를 반환하면{" "}
            <Code>notFound()</Code>를 호출합니다. 이 호출은 다른 <Code>await</Code>나{" "}
            <Code>{"<Suspense>"}</Code>보다 <strong>앞에</strong> 있어야 실제 404 상태 코드가
            나갑니다. 스트리밍이 시작된 뒤에는 상태 코드를 바꿀 수 없기 때문입니다.
          </>
        }
      >
        <div className="flex flex-wrap gap-2">
          <Link
            href="/examples/posts/없는-글"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            /examples/posts/없는-글
          </Link>
          <Link
            href="/examples/posts/turbopack"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            /examples/posts/turbopack (정상)
          </Link>
        </div>
      </Section>
    </div>
  )
}
