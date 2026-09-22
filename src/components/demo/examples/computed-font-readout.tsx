"use client"

import * as React from "react"
import { cn } from "cn"

/**
 * 실제로 적용된 font-family 문자열을 읽어서 함께 보여줍니다.
 *
 * 폰트 변수 배선이 끊어져도 fallback 폰트가 대신 렌더되기 때문에 육안으로는 판별하기
 * 어렵습니다. 결과에 "Pretendard"가 보이면 배선이 살아 있는 것이고, ui-sans-serif 계열만
 * 보이면 next/font 변수가 @theme inline의 참조와 어긋난 것입니다.
 */
export function ComputedFontReadout({
  className,
  sample = "다람쥐 헌 쳇바퀴에 타고파 0123",
}: {
  className: string
  sample?: string
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [family, setFamily] = React.useState<string | null>(null)

  // getComputedStyle은 마운트 이후에만 읽습니다. 서버에서 미리 렌더하면 불일치가 납니다.
  React.useEffect(() => {
    if (ref.current) {
      setFamily(getComputedStyle(ref.current).fontFamily)
    }
  }, [])

  return (
    <div className="space-y-1">
      <span ref={ref} className={cn("block text-base", className)}>
        {sample}
      </span>
      <span className="block font-mono text-[10px] break-all text-muted-foreground">
        {family ?? "측정 중…"}
      </span>
    </div>
  )
}
