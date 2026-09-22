import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * shadcn 생성물에서 한 곳을 고쳤습니다: grid 트랙이 원래 `auto_1fr`이었습니다.
 * grid의 `1fr`은 `minmax(auto, 1fr)`이라 트랙이 콘텐츠의 min-content 폭 아래로
 * 줄어들지 못합니다. 그래서 Alert 안에 코드 블록이나 긴 URL을 넣으면
 * 그 요소에 `overflow-x-auto`를 걸어 두어도 트랙이 넓어져 **페이지 전체에 가로
 * 스크롤**이 생깁니다. (/examples/theme의 차트 토큰 경고에서 375px 폭에 178px
 * 오버플로로 실측했습니다.)
 *
 * `minmax(0,1fr)`로 바꾸면 넓은 화면의 모양은 그대로이고 좁은 화면에서만 줄어듭니다.
 * `npx shadcn@latest add alert`로 재생성하면 이 수정이 사라집니다.
 */
const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_minmax(0,1fr)] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2 right-2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
