"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type TokenRow = {
  name: string
  light: string
  dark: string
  same: boolean
}

/**
 * 색 토큰의 라이트 값과 다크 값을 한 화면에서 동시에 실측합니다.
 *
 * 원리: `.dark { --background: … }` 는 단순한 CSS 변수 재선언입니다.
 * 그래서 화면 밖에 `.dark` 클래스를 가진 프로브 엘리먼트를 하나 두고 그 computed style을 읽으면,
 * 지금 테마를 바꾸지 않고도 다크 값을 그대로 얻을 수 있습니다.
 *
 * 값이 라이트와 다크에서 같은 토큰에는 "동일" 배지가 붙습니다.
 * chart-1부터 chart-5까지가 여기에 걸리는데, baseColor가 neutral이라 애초에 같은 값이기 때문입니다.
 */
export function TokenValueTable({ vars }: { vars: string[] }) {
  const lightRef = React.useRef<HTMLDivElement>(null)
  const darkRef = React.useRef<HTMLDivElement>(null)
  const [rows, setRows] = React.useState<TokenRow[]>([])

  // getComputedStyle은 브라우저 API이므로 마운트 이후에만 읽습니다.
  // 서버에서 미리 렌더하면 하이드레이션 불일치가 발생합니다.
  React.useEffect(() => {
    const lightEl = lightRef.current
    const darkEl = darkRef.current
    if (!lightEl || !darkEl) return

    const lightStyle = getComputedStyle(lightEl)
    const darkStyle = getComputedStyle(darkEl)

    setRows(
      vars.map((name) => {
        const light = lightStyle.getPropertyValue(name).trim()
        const dark = darkStyle.getPropertyValue(name).trim()
        return { name, light, dark, same: light === dark }
      })
    )
  }, [vars])

  const sameCount = rows.filter((row) => row.same).length

  return (
    <div className="space-y-3">
      {/*
        프로브. display:none이면 computed 값을 못 읽는 브라우저가 있으므로
        크기를 0으로 만들어 숨깁니다.
      */}
      <div aria-hidden className="pointer-events-none absolute size-0 overflow-hidden">
        <div ref={lightRef} />
        <div ref={darkRef} className="dark" />
      </div>

      {rows.length === 0 ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            토큰 {rows.length}개 중 {sameCount}개가 라이트와 다크에서 같은 값입니다. 원본은{" "}
            <code className="font-mono">oklch()</code>로 적혀 있지만, 브라우저가{" "}
            <code className="font-mono">lab()</code>으로 직렬화해 돌려주기 때문에 표기가 다릅니다.
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">CSS 변수</TableHead>
                  <TableHead>라이트</TableHead>
                  <TableHead>다크</TableHead>
                  <TableHead className="w-20 text-right">비교</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="font-mono text-xs">{row.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {row.light || "(빈 값)"}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {row.dark || "(빈 값)"}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.same ? (
                        <Badge variant="destructive">동일</Badge>
                      ) : (
                        <Badge variant="secondary">다름</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
