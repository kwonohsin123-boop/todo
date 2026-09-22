"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="icon" aria-label="테마 전환" />}
      >
        <SunIcon className="size-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
        <MoonIcon className="absolute size-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>라이트</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>다크</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>시스템</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
