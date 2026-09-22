import Link from "next/link"
import { notFound } from "next/navigation"
import { cn } from "cn"

import { Code } from "@/components/examples/code"
import { ExamplePageHeader } from "@/components/examples/example-page-header"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getPost, getPostSlugs } from "@/lib/examples/posts"

/** 빌드 시점에 프리렌더할 slug 목록입니다. 반환 타입은 params 객체의 배열입니다. */
export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

/**
 * metadata 객체와 generateMetadata를 같은 세그먼트에서 동시에 export할 수는 없습니다.
 * 첫 인자는 PageProps로 타이핑해도 됩니다. params는 Promise입니다.
 */
export async function generateMetadata({ params }: PageProps<"/examples/posts/[slug]">) {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) {
    return { title: "찾을 수 없는 글" }
  }

  return { title: post.title, description: post.summary }
}

export default async function PostDetailPage({ params }: PageProps<"/examples/posts/[slug]">) {
  const { slug } = await params
  const post = getPost(slug)

  // 다른 await나 Suspense 경계보다 앞에서 호출해야 진짜 404가 나갑니다.
  if (!post) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-14">
      <ExamplePageHeader
        title={post.title}
        description={post.summary}
        parent={{ href: "/examples/posts", label: "동적 라우트" }}
      />

      <Separator />

      <article className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{post.tag}</Badge>
          <span className="font-mono text-xs text-muted-foreground">{post.publishedAt}</span>
        </div>
        <p className="text-base leading-relaxed">{post.body}</p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">이 페이지에서 확인된 것</CardTitle>
          <CardDescription>
            아래 값들은 모두 서버에서 <Code>await params</Code>로 얻은 것입니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5 font-mono text-xs">
          <p>params.slug = &quot;{slug}&quot;</p>
          <p>라우트 = /examples/posts/[slug]</p>
          <p>브라우저 탭 제목 = generateMetadata가 반환한 title</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/examples/posts"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          목록으로
        </Link>
        <Link
          href={`/api/posts/${post.slug}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          같은 데이터를 Route Handler로 보기
        </Link>
      </div>
    </div>
  )
}
