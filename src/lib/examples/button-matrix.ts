import type { VariantProps } from "class-variance-authority"

import type { buttonVariants } from "@/components/ui/button"

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>

/**
 * cva에 런타임 값을 넘기는 것은 안전합니다.
 * 클래스 문자열이 button.tsx 안에 리터럴로 존재하므로 Tailwind 스캐너가 이미 발견했습니다.
 * (반대로 tokens.ts의 색 클래스는 리터럴로 적어야 합니다.)
 */
export const buttonVariantList: ButtonVariant[] = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
]

export const buttonSizeList: {
  size: ButtonSize
  label: string
  /** 아이콘 전용 크기. 텍스트 대신 아이콘만 넣고 aria-label을 붙여야 합니다. */
  iconOnly: boolean
}[] = [
  { size: "xs", label: "xs · h-6", iconOnly: false },
  { size: "sm", label: "sm · h-7", iconOnly: false },
  { size: "default", label: "default · h-8", iconOnly: false },
  { size: "lg", label: "lg · h-9", iconOnly: false },
  { size: "icon-xs", label: "icon-xs · size-6", iconOnly: true },
  { size: "icon-sm", label: "icon-sm · size-7", iconOnly: true },
  { size: "icon", label: "icon · size-8", iconOnly: true },
  { size: "icon-lg", label: "icon-lg · size-9", iconOnly: true },
]

export const badgeVariantList = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
  "link",
] as const
