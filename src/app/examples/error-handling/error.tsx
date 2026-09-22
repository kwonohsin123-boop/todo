"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "cn"
import { RotateCcwIcon, TriangleAlertIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"

/**
 * 에러 경계는 반드시 클라이언트 컴포넌트여야 합니다.
 *
 * retry는 Next.js 16.3.0에서 stable이 되었습니다 (16.2에서 unstable_retry로 도입).
 * retry()는 children을 다시 fetch하고 다시 렌더합니다.
 * reset()은 여전히 존재하지만 refetch 없이 에러 상태만 초기화하므로,
 * 공식 문서는 대부분의 경우 retry()를 쓰라고 권합니다.
 *
 * 이 파일은 같은 세그먼트의 page.tsx와 그 하위를 감싸지만,
 * 같은 세그먼트의 layout.tsx는 감싸지 않습니다.
 */
export default function ErrorHandlingError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  React.useEffect(() => {
    // 실제 프로젝트에서는 여기서 에러 리포팅 서비스로 보냅니다.
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-14">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">오류가 발생했습니다</h1>
        <p className="text-muted-foreground">
          page.tsx가 던진 예외를 같은 세그먼트의 error.tsx가 잡았습니다. 헤더와 푸터가 그대로
          남아 있는 것은 이 경계가 레이아웃 아래에만 걸려 있기 때문입니다.
        </p>
      </div>

      <Alert variant="destructive">
        <TriangleAlertIcon />
        <AlertTitle>
          {error.digest ? "서버에서 발생한 오류 (프로덕션)" : "발생한 오류 (개발 모드)"}
        </AlertTitle>
        <AlertDescription>
          <p className="font-mono text-xs break-all">{error.message}</p>
          {error.digest ? (
            <>
              <p className="mt-2 font-mono text-xs">digest: {error.digest}</p>
              <p className="mt-2">
                프로덕션 빌드에서는 서버 컴포넌트의 원본 메시지가 클라이언트로 전달되지 않습니다.
                위 메시지가 minified React 오류로 바뀐 것이 그 결과이고, 실제 원인은{" "}
                <strong>digest 값으로 서버 로그와 대조</strong>해서 찾습니다.
              </p>
            </>
          ) : (
            <p className="mt-2">
              개발 모드에서는 원본 메시지가 그대로 보입니다. 프로덕션에서는 이 자리가 일반화된
              메시지로 바뀌고 digest 값이 함께 내려옵니다.
            </p>
          )}
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => retry()}>
          <RotateCcwIcon />
          다시 시도 (retry)
        </Button>
        <Link
          href="/examples/error-handling"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          정상 상태로 돌아가기
        </Link>
      </div>

      <p className="text-sm text-muted-foreground">
        일시적 오류(<code className="font-mono">?boom=once</code>)였다면 다시 시도 한 번으로
        복구됩니다. 항상 실패하는 오류(<code className="font-mono">?boom=server</code>)는 조건이
        같으므로 다시 시도해도 같은 에러가 납니다.
      </p>
    </div>
  )
}
