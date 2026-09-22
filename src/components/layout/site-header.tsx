import Link from "next/link"
import { TargetIcon } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* 헤더는 브랜드와 테마 토글만 둡니다. 내비게이션은 푸터로 옮겼습니다. */}
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <TargetIcon className="size-5" />
          <span>오늘의 MIT</span>
        </Link>
        <ModeToggle />
      </div>
    </header>
  )
}
