import { ServerIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { formatServerTime } from "@/lib/examples/timing"

/**
 * 서버 컴포넌트입니다. process는 브라우저에 없으므로, 이 값이 보이면
 * 이 조각이 확실히 서버에서 렌더됐다는 뜻입니다.
 */
export function RenderStamp({ label = "서버에서 렌더됨" }: { label?: string }) {
  return (
    <div className="space-y-2 rounded-lg border border-dashed p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          <ServerIcon />
          {label}
        </Badge>
      </div>
      <dl className="space-y-0.5 font-mono text-[11px] text-muted-foreground">
        <div>
          <dt className="inline">렌더 시각: </dt>
          <dd className="inline">{formatServerTime()}</dd>
        </div>
        <div>
          <dt className="inline">process.version: </dt>
          <dd className="inline">{process.version}</dd>
        </div>
        <div>
          <dt className="inline">typeof window: </dt>
          <dd className="inline">{typeof window}</dd>
        </div>
      </dl>
    </div>
  )
}
