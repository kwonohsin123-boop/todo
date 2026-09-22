import * as React from "react"
import { cn } from "cn"

type SectionProps = {
  id: string
  title: string
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/**
 * 예제 화면의 섹션 셸입니다.
 * scroll-mt-20은 sticky 헤더(h-14) 때문에 앵커 이동 시 제목이 가려지는 것을 막습니다.
 */
export function Section({ id, title, description, children, className }: SectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="space-y-1.5">
        <h2 id={id} className="scroll-mt-20 text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        {description ? (
          <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}
