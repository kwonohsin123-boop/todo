import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

// Pretendard Variable — 한글 글리프를 담은 가변 폰트(src/fonts/).
// CSS 변수명은 반드시 --font-sans 여야 합니다. globals.css의 @theme inline이 이 이름을 참조하고
// @layer base의 html { @apply font-sans }가 그것을 소비합니다.
// 이름을 바꾸면 빌드 에러 없이 폰트만 조용히 사라집니다.
// next/font/local은 subsets를 지원하지 않으므로 넣지 않습니다.
const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  variable: "--font-sans",
  weight: "45 920", // 패키지 원본 CSS가 선언한 실제 wght 축 범위 (100 900 아님)
  style: "normal",
  display: "swap",
})

// mono는 Geist Mono 유지. 변수명(--font-geist-mono)의 비대칭은 의도된 것입니다.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "오늘의 MIT — 하루 3가지 핵심 업무",
    template: "%s · 오늘의 MIT",
  },
  description:
    "오늘 반드시 끝내야 할 핵심 업무 3가지에 집중하고, 타임블록으로 시간을 배분하는 미니멀 시간 관리 앱",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${pretendard.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
