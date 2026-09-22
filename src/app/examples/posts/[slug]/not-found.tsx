import Link from "next/link"
import { cn } from "cn"
import { FileQuestionMarkIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

/**
 * notFound()가 호출되면 이 컴포넌트가 렌더됩니다.
 * props를 받지 않습니다 — 어떤 slug가 실패했는지 알고 싶으면 상위에서 처리해야 합니다.
 * 비스트리밍 응답에서는 404, 스트리밍 응답에서는 200으로 나갑니다.
 */
export default function PostNotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed p-12 text-center">
        <FileQuestionMarkIcon className="size-10 text-muted-foreground" />
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">글을 찾을 수 없습니다</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            요청한 slug에 해당하는 글이 목업 데이터에 없습니다. not-found.tsx는 props를 받지
            않으므로, 어떤 slug였는지는 이 화면에서 알 수 없습니다.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/examples/posts" className={cn(buttonVariants({ size: "sm" }))}>
            글 목록으로
          </Link>
          <Link
            href="/examples"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            예제 목록으로
          </Link>
        </div>
      </div>
    </div>
  )
}
