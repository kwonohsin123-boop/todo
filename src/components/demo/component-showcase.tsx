"use client"

import { BellIcon } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ComponentShowcase() {
  return (
    <Tabs defaultValue="overlay" className="w-full">
      <TabsList>
        <TabsTrigger value="overlay">오버레이</TabsTrigger>
        <TabsTrigger value="form">폼</TabsTrigger>
      </TabsList>

      <TabsContent value="overlay" className="pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              다이얼로그 열기
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>프로필 수정</DialogTitle>
                <DialogDescription>
                  변경한 내용은 저장을 눌러야 반영됩니다.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                <Label htmlFor="dialog-name">이름</Label>
                <Input id="dialog-name" defaultValue="홍길동" />
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost" />}>취소</DialogClose>
                <Button onClick={() => toast.success("저장되었습니다")}>저장</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="secondary"
            onClick={() =>
              toast("알림", { description: "sonner 토스트가 동작합니다." })
            }
          >
            <BellIcon />
            토스트 띄우기
          </Button>

          <Tooltip>
            <TooltipTrigger
              render={
                <Avatar>
                  <AvatarFallback>홍</AvatarFallback>
                </Avatar>
              }
            />
            <TooltipContent>홍길동</TooltipContent>
          </Tooltip>
        </div>
      </TabsContent>

      <TabsContent value="form" className="pt-4">
        <div className="grid max-w-sm gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button onClick={() => toast.success("제출되었습니다")}>제출</Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
