"use client"

import * as React from "react"
import {
  BellIcon,
  CopyIcon,
  SettingsIcon,
  Share2Icon,
  Trash2Icon,
  UserIcon,
} from "lucide-react"
import { toast } from "sonner"

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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { sleep } from "@/lib/examples/timing"

export function OverlayPrimitives() {
  const [showShortcuts, setShowShortcuts] = React.useState(true)
  const [showBadges, setShowBadges] = React.useState(false)
  const [density, setDensity] = React.useState("comfortable")

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* 트리거 합성은 Radix의 asChild가 아니라 render prop입니다. */}
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>다이얼로그</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>포커스 트랩 확인</DialogTitle>
              <DialogDescription>
                Tab을 계속 누르면 포커스가 이 안에서만 순환합니다. Esc 또는 바깥 클릭으로 닫으면
                포커스가 트리거 버튼으로 되돌아갑니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <Label htmlFor="overlay-dialog-name">이름</Label>
              <Input id="overlay-dialog-name" defaultValue="홍길동" />
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="ghost" />}>취소</DialogClose>
              <Button onClick={() => toast.success("저장되었습니다")}>저장</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>팝오버</PopoverTrigger>
          {/* align · side · sideOffset을 Positioner가 아니라 Content에 직접 넘깁니다. */}
          <PopoverContent align="start" side="bottom" sideOffset={8}>
            <PopoverHeader>
              <PopoverTitle>Positioner가 숨어 있습니다</PopoverTitle>
              <PopoverDescription>
                Base UI 원본은 Portal · Positioner · Popup을 직접 조합해야 하지만, 이 프로젝트의
                PopoverContent가 그 세 겹을 감싸고 배치 prop만 밖으로 꺼내 둡니다.
              </PopoverDescription>
            </PopoverHeader>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toast("팝오버 안의 버튼이 동작합니다")}
              >
                확인
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            드롭다운 메뉴
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>계정</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => toast("프로필로 이동")}>
                <UserIcon />
                프로필
                {showShortcuts ? <DropdownMenuShortcut>⌘P</DropdownMenuShortcut> : null}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("설정으로 이동")}>
                <SettingsIcon />
                설정
                {showShortcuts ? <DropdownMenuShortcut>⌘,</DropdownMenuShortcut> : null}
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>표시</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={showShortcuts}
              onCheckedChange={(value) => setShowShortcuts(value)}
            >
              단축키 표시
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showBadges}
              onCheckedChange={(value) => setShowBadges(value)}
            >
              배지 표시
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>밀도</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={density}
              onValueChange={(value) => setDensity(String(value))}
            >
              <DropdownMenuRadioItem value="compact">촘촘하게</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="comfortable">보통</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="spacious">넓게</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Share2Icon />
                공유
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => toast("링크를 복사했습니다")}>
                  <CopyIcon />
                  링크 복사
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast("메일 초안을 열었습니다")}>
                  메일로 보내기
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() => toast.error("삭제했습니다")}
            >
              <Trash2Icon />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="알림" />}>
            <BellIcon />
          </TooltipTrigger>
          <TooltipContent>
            TooltipProvider의 prop은 delay입니다 (Radix의 delayDuration이 아님)
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">토스트 (sonner)</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => toast("기본 토스트")}>
            기본
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => toast.success("성공했습니다", { description: "아이콘이 자동으로 붙습니다." })}
          >
            success
          </Button>
          <Button size="sm" variant="secondary" onClick={() => toast.info("참고 사항입니다")}>
            info
          </Button>
          <Button size="sm" variant="secondary" onClick={() => toast.warning("주의가 필요합니다")}>
            warning
          </Button>
          <Button size="sm" variant="secondary" onClick={() => toast.error("실패했습니다")}>
            error
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              toast.promise(sleep(1200), {
                loading: "처리 중…",
                success: "완료되었습니다",
                error: "실패했습니다",
              })
            }
          >
            promise
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              toast("되돌릴 수 있습니다", {
                action: { label: "되돌리기", onClick: () => toast.success("되돌렸습니다") },
              })
            }
          >
            action
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Toaster는 layout.tsx에서 TooltipProvider의 형제로 한 번만 마운트되어 있고, next-themes의
          테마를 따라갑니다.
        </p>
      </div>
    </div>
  )
}
