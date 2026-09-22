import * as React from "react"
import { cn } from "cn"

/** 본문 안 인라인 코드. 기존 화면(src/app/icons/page.tsx)의 표기를 그대로 따릅니다. */
export function Code({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] break-all",
        className
      )}
      {...props}
    />
  )
}
