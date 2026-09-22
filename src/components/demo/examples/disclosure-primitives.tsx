"use client"

import * as React from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DisclosurePrimitives() {
  const [openItems, setOpenItems] = React.useState<unknown[]>(["multi-a"])

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">여러 개 동시 열기 (기본값)</p>
            <Badge variant="secondary">{openItems.length}개 열림</Badge>
          </div>
          <Accordion value={openItems} onValueChange={(value) => setOpenItems(value)}>
            <AccordionItem value="multi-a">
              <AccordionTrigger>첫 번째 항목</AccordionTrigger>
              <AccordionContent>
                Base UI 아코디언의 value는 배열입니다. Radix의 type=&quot;multiple&quot;에 해당하는
                동작이 기본값입니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="multi-b">
              <AccordionTrigger>두 번째 항목</AccordionTrigger>
              <AccordionContent>
                둘을 동시에 열어 보면 위쪽 배지의 숫자가 2가 됩니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">하나만 열기 (multiple={"{false}"})</p>
          <Accordion multiple={false} defaultValue={["single-a"]}>
            <AccordionItem value="single-a">
              <AccordionTrigger>하나를 열면</AccordionTrigger>
              <AccordionContent>다른 항목이 자동으로 닫힙니다.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="single-b">
              <AccordionTrigger>다른 항목을 열어 보세요</AccordionTrigger>
              <AccordionContent>
                위 항목이 접히면서 animate-accordion-up 키프레임이 재생됩니다.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium">
            탭 · variant=&quot;default&quot; · 수평
          </p>
          <Tabs defaultValue="a">
            <TabsList>
              <TabsTrigger value="a">개요</TabsTrigger>
              <TabsTrigger value="b">설정</TabsTrigger>
              <TabsTrigger value="c" disabled>
                비활성
              </TabsTrigger>
            </TabsList>
            <TabsContent value="a" className="pt-3 text-sm text-muted-foreground">
              활성 탭에는 data-active 속성이 붙습니다. 방향키로 탭을 이동할 수 있습니다.
            </TabsContent>
            <TabsContent value="b" className="pt-3 text-sm text-muted-foreground">
              루트에는 data-horizontal, 세로 방향이면 data-vertical이 붙어 리스트 레이아웃이
              바뀝니다.
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">
            탭 · variant=&quot;line&quot; · 수직
          </p>
          <Tabs defaultValue="x" orientation="vertical">
            <TabsList variant="line">
              <TabsTrigger value="x">첫째</TabsTrigger>
              <TabsTrigger value="y">둘째</TabsTrigger>
              <TabsTrigger value="z">셋째</TabsTrigger>
            </TabsList>
            <TabsContent value="x" className="text-sm text-muted-foreground">
              line 변형은 배경 대신 활성 탭 옆에 선을 그립니다.
            </TabsContent>
            <TabsContent value="y" className="text-sm text-muted-foreground">
              수직 방향에서는 그 선이 오른쪽으로 붙습니다.
            </TabsContent>
            <TabsContent value="z" className="text-sm text-muted-foreground">
              선 위치는 after 의사 요소를 data-horizontal / data-vertical로 갈라 처리합니다.
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
