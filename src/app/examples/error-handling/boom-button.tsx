"use client"

import * as React from "react"
import { BombIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * 클라이언트 렌더 중에 던진 예외도 같은 error.tsx 경계가 잡습니다.
 * 이벤트 핸들러 안에서 그냥 throw하면 React 트리 밖이라 경계에 걸리지 않으므로,
 * 상태를 바꿔 다음 렌더에서 던집니다.
 */
export function BoomButton() {
  const [shouldThrow, setShouldThrow] = React.useState(false)

  if (shouldThrow) {
    throw new Error("클라이언트 컴포넌트 렌더 중에 발생한 예외입니다.")
  }

  return (
    <Button variant="outline" onClick={() => setShouldThrow(true)}>
      <BombIcon />
      클라이언트에서 예외 던지기
    </Button>
  )
}
