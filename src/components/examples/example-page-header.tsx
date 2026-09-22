import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type ExamplePageHeaderProps = {
  title: string
  description: string
  /** 이 화면이 검증하는 항목들. 배지로 나열합니다. */
  checks?: string[]
  /** 동적 라우트처럼 한 단계 더 들어간 화면용 중간 경로 */
  parent?: { href: string; label: string }
}

export function ExamplePageHeader({
  title,
  description,
  checks,
  parent,
}: ExamplePageHeaderProps) {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {/* Base UI의 render prop으로 next/link와 합성합니다. Radix의 asChild가 아닙니다. */}
            <BreadcrumbLink render={<Link href="/examples" />}>예제</BreadcrumbLink>
          </BreadcrumbItem>
          {parent ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href={parent.href} />}>
                  {parent.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          ) : null}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="max-w-3xl text-muted-foreground">{description}</p>
      </div>

      {checks && checks.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {checks.map((check) => (
            <Badge key={check} variant="outline">
              {check}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}
