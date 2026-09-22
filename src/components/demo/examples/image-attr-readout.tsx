"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"

type ImageInfo = {
  currentSrc: string
  srcSet: string
  sizes: string
  loading: string
  naturalWidth: number
  naturalHeight: number
}

/**
 * 안에 렌더된 img 엘리먼트의 실제 속성을 읽어 보여줍니다.
 *
 * - currentSrc: 브라우저가 최종적으로 고른 URL. /_next/image? 로 시작하면 최적화를 거친 것입니다.
 * - srcSet: 비어 있으면 리사이즈 후보가 생성되지 않았다는 뜻입니다 (SVG가 그렇습니다).
 * - naturalWidth/Height: 실제로 내려받은 픽셀 크기. sizes에 따라 달라집니다.
 */
export function ImageAttrReadout({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [info, setInfo] = React.useState<ImageInfo | null>(null)

  React.useEffect(() => {
    const image = ref.current?.querySelector("img")
    if (!image) return

    const read = () => {
      setInfo({
        currentSrc: image.currentSrc,
        srcSet: image.srcset,
        sizes: image.sizes,
        loading: image.loading,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
      })
    }

    if (image.complete) read()
    image.addEventListener("load", read)
    return () => image.removeEventListener("load", read)
  }, [])

  const optimized = info?.currentSrc.includes("/_next/image") ?? false

  return (
    <div className="space-y-2">
      <div ref={ref}>{children}</div>

      <div className="space-y-1.5 rounded-lg bg-muted/50 p-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {info ? (
            <>
              <Badge variant={optimized ? "secondary" : "outline"}>
                {optimized ? "최적화 경유" : "원본 그대로"}
              </Badge>
              <Badge variant="outline" className="font-mono text-[10px]">
                {info.naturalWidth}×{info.naturalHeight}
              </Badge>
              <Badge variant="outline" className="font-mono text-[10px]">
                loading={info.loading}
              </Badge>
              <Badge variant={info.srcSet ? "secondary" : "destructive"}>
                srcSet {info.srcSet ? `후보 ${info.srcSet.split(",").length}개` : "없음"}
              </Badge>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">측정 중…</span>
          )}
        </div>

        {info ? (
          <dl className="space-y-1 font-mono text-[10px] break-all text-muted-foreground">
            <div>
              <dt className="inline font-semibold">currentSrc: </dt>
              <dd className="inline">{info.currentSrc || "(없음)"}</dd>
            </div>
            <div>
              <dt className="inline font-semibold">sizes: </dt>
              <dd className="inline">{info.sizes || "(없음)"}</dd>
            </div>
          </dl>
        ) : null}
      </div>
    </div>
  )
}
