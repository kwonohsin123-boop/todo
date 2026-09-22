"use client"

import * as React from "react"
import { MonitorSmartphoneIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatServerTime } from "@/lib/examples/timing"

type ClientInfo = {
  loadedAt: string
  windowType: string
}

/**
 * 이 모듈이 브라우저에서 평가될 때의 정보입니다.
 * 서버에서는 window가 없으므로 null이 됩니다.
 */
const clientInfo: ClientInfo | null =
  typeof window === "undefined"
    ? null
    : { loadedAt: formatServerTime(), windowType: typeof window }

/** 변하지 않는 값이므로 구독은 아무것도 하지 않습니다. */
const subscribe = () => () => {}
const getClientSnapshot = () => clientInfo
const getServerSnapshot = (): ClientInfo | null => null

export function ClientStamp({ children }: { children?: React.ReactNode }) {
  /**
   * 서버 스냅샷과 클라이언트 스냅샷을 따로 주면, 하이드레이션 시점에는 서버 스냅샷이 쓰여
   * 서버가 보낸 HTML과 정확히 일치하고, 하이드레이션이 끝난 뒤 실제 값으로 다시 렌더됩니다.
   *
   * typeof window처럼 환경에 따라 달라지는 값을 JSX에 그대로 쓰면 바로 하이드레이션
   * 불일치(React #418)가 납니다. 그래서 그 값도 이 스냅샷에 함께 담았습니다.
   *
   * useEffect에서 setState로 같은 일을 할 수도 있지만,
   * eslint의 react-hooks/set-state-in-effect 규칙이 그 방식을 막습니다.
   */
  const info = React.useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)

  const [clicks, setClicks] = React.useState(0)

  return (
    <div className="space-y-3 rounded-lg border p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>
          <MonitorSmartphoneIcon />
          브라우저에서 실행됨
        </Badge>
        <Button size="xs" variant="outline" onClick={() => setClicks((count) => count + 1)}>
          상태 변경 ({clicks})
        </Button>
      </div>

      <dl className="space-y-0.5 font-mono text-[11px] text-muted-foreground">
        <div>
          <dt className="inline">번들 평가 시각: </dt>
          <dd className="inline">{info?.loadedAt ?? "하이드레이션 대기 중"}</dd>
        </div>
        <div>
          <dt className="inline">상태 변경 횟수: </dt>
          <dd className="inline">{clicks}</dd>
        </div>
        <div>
          <dt className="inline">typeof window: </dt>
          <dd className="inline">{info?.windowType ?? "undefined"}</dd>
        </div>
      </dl>

      {children ? (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium">
            ↓ children 슬롯으로 주입된 서버 컴포넌트
          </p>
          {children}
        </div>
      ) : null}
    </div>
  )
}
