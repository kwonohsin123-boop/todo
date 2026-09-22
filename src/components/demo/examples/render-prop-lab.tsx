"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "cn"
import { ExternalLinkIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

/** 엘리먼트에 실제로 붙어 있는 data-* 속성을 읽어옵니다. */
function readDataAttributes(element: HTMLElement | null) {
  if (!element) return []
  return Array.from(element.attributes)
    .filter((attribute) => attribute.name.startsWith("data-"))
    .map((attribute) => ({ name: attribute.name, value: attribute.value }))
}

/**
 * 트리거의 data-* 속성을 실시간으로 관찰합니다.
 * 팝오버를 열고 닫으면 data-popup-open이 붙고 사라지는 걸 볼 수 있습니다.
 */
function useObservedDataAttributes(ref: React.RefObject<HTMLElement | null>) {
  const [attributes, setAttributes] = React.useState<{ name: string; value: string }[]>([])

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    setAttributes(readDataAttributes(element))

    const observer = new MutationObserver(() => {
      setAttributes(readDataAttributes(element))
    })
    observer.observe(element, { attributes: true })

    return () => observer.disconnect()
  }, [ref])

  return attributes
}

export function RenderPropLab() {
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const attributes = useObservedDataAttributes(triggerRef)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-xl border p-4">
          <p className="text-sm font-medium">1. JSX 엘리먼트를 넘기는 형태</p>
          <p className="text-xs text-muted-foreground">
            가장 흔한 형태입니다. 자식을 넘기는 asChild와 달리, 대체할 엘리먼트를 render prop의
            값으로 넘깁니다.
          </p>
          <Popover>
            <PopoverTrigger ref={triggerRef} render={<Button variant="outline" />}>
              열기 · render=&#123;&lt;Button /&gt;&#125;
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>트리거가 Button으로 렌더됐습니다</PopoverTitle>
                <PopoverDescription>
                  Button의 클래스와 Popover 트리거의 동작이 합쳐졌습니다.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2 rounded-xl border p-4">
          <p className="text-sm font-medium">2. 함수로 props를 직접 펼치는 형태</p>
          <p className="text-xs text-muted-foreground">
            버튼이 아닌 엘리먼트로 바꿀 때는 <code className="font-mono">nativeButton=&#123;false&#125;</code>
            를 함께 줘야 접근성 속성이 올바르게 붙습니다.
          </p>
          <Popover>
            <PopoverTrigger
              nativeButton={false}
              render={(props) => (
                <span
                  {...props}
                  className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-primary underline underline-offset-4"
                />
              )}
            >
              열기 · render=&#123;(props) =&gt; …&#125;
              <ExternalLinkIcon className="size-3.5" />
            </PopoverTrigger>
            <PopoverContent align="start">
              <PopoverHeader>
                <PopoverTitle>span으로 렌더됐습니다</PopoverTitle>
                <PopoverDescription>
                  props에는 id · aria-* · 이벤트 핸들러가 모두 들어 있습니다. 하나라도 빠뜨리면
                  동작이 깨집니다.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2 rounded-xl border p-4">
          <p className="text-sm font-medium">3. 두 번째 인자로 상태를 받는 형태</p>
          <p className="text-xs text-muted-foreground">
            render 함수의 두 번째 인자가 컴포넌트의 상태입니다. 상태에 따라 라벨 자체를 바꿀 수
            있습니다.
          </p>
          <Popover>
            <PopoverTrigger
              render={(props, state) => (
                <Button variant={state.open ? "default" : "outline"} {...props}>
                  {state.open ? "열려 있음" : "닫혀 있음"}
                </Button>
              )}
            />
            <PopoverContent align="start">
              <PopoverHeader>
                <PopoverTitle>state.open으로 분기했습니다</PopoverTitle>
                <PopoverDescription>
                  열려 있는 동안 트리거의 variant가 default로 바뀝니다.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2 rounded-xl border p-4">
          <p className="text-sm font-medium">4. className도 상태의 함수일 수 있습니다</p>
          <p className="text-xs text-muted-foreground">
            Base UI의 className은 문자열뿐 아니라 상태를 받는 함수도 받습니다. data-* 변형 없이
            분기하고 싶을 때 씁니다.
          </p>
          <Popover>
            <PopoverTrigger
              className={(state) =>
                cn(
                  "inline-flex h-8 items-center rounded-lg border px-2.5 text-sm font-medium transition-colors",
                  state.open ? "border-primary bg-primary/10 text-primary" : "bg-background"
                )
              }
            >
              className=&#123;(state) =&gt; …&#125;
            </PopoverTrigger>
            <PopoverContent align="start">
              <PopoverHeader>
                <PopoverTitle>상태 기반 className</PopoverTitle>
                <PopoverDescription>
                  data-open 변형과 결과는 같지만, CSS 대신 JS에서 분기합니다.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border p-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">1번 트리거의 속성 실시간 관찰</p>
          <Badge variant="secondary">{attributes.length}개</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          MutationObserver로 속성 변화를 구독합니다. 위 1번 버튼을 열고 닫으면 목록이 바뀝니다.
          모든 프리미티브가 <code className="font-mono">data-slot</code>을 갖는다는 것도 여기서
          확인할 수 있습니다.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {attributes.length === 0 ? (
            <span className="text-xs text-muted-foreground">측정 중…</span>
          ) : (
            attributes.map((attribute) => (
              <Badge key={attribute.name} variant="outline" className="font-mono text-[10px]">
                {attribute.value ? `${attribute.name}="${attribute.value}"` : attribute.name}
              </Badge>
            ))
          )}
        </div>
      </div>

      <div className="space-y-2 rounded-xl border p-4">
        <p className="text-sm font-medium">배지도 render prop을 받습니다</p>
        <p className="text-xs text-muted-foreground">
          Badge는 useRender와 mergeProps로 만들어져 있어 링크로 바꿀 수 있고, 그때{" "}
          <code className="font-mono">[a]:hover:</code> 셀렉터가 활성화됩니다.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge>기본 span</Badge>
          <Badge variant="outline" render={<Link href="/examples" />}>
            링크로 렌더된 배지
          </Badge>
          <Badge variant="secondary">
            <ExternalLinkIcon />
            아이콘은 size-3으로 강제됩니다
          </Badge>
        </div>
      </div>
    </div>
  )
}
