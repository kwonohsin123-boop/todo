import Link from "next/link"

// typedRoutes가 꺼져 있어 href 오타는 타입 에러가 아니라 런타임 404입니다.
const footerLinks = [
  { href: "/examples", label: "검증 화면" },
  { href: "/icons", label: "아이콘" },
]

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-1 px-4 py-6 text-center text-sm text-muted-foreground sm:flex-row sm:gap-4">
        <p>Next.js 16 · React 19 · Tailwind CSS 4 · shadcn/ui</p>
        <nav className="flex items-center gap-4">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <p>© {new Date().getFullYear()} 오늘의 MIT</p>
      </div>
    </footer>
  )
}
