"use client"

import { useActionState } from "react"
import { LoaderCircleIcon, SendIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { initialGuestbookState } from "@/lib/examples/guestbook"

import { submitGuestbook } from "./actions"

export function GuestbookForm() {
  // 세 번째 반환값이 pending입니다. useFormStatus를 따로 쓰지 않아도 됩니다.
  const [state, formAction, isPending] = useActionState(
    submitGuestbook,
    initialGuestbookState
  )

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="guestbook-name">이름</Label>
        <Input
          id="guestbook-name"
          name="name"
          defaultValue={state.values.name}
          placeholder="2자 이상"
          /*
            false를 넘기면 aria-invalid="false"가 렌더되어 aria-invalid: 변형이 걸려 버립니다.
            그래서 값이 없을 때는 undefined로 만들어 속성 자체를 빼야 합니다.
          */
          aria-invalid={Boolean(state.errors.name) || undefined}
          aria-describedby={state.errors.name ? "guestbook-name-error" : undefined}
        />
        {state.errors.name ? (
          <p id="guestbook-name-error" className="text-xs text-destructive">
            {state.errors.name}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="guestbook-body">내용</Label>
        <Textarea
          id="guestbook-body"
          name="body"
          defaultValue={state.values.body}
          placeholder="5자 이상 200자 이하"
          aria-invalid={Boolean(state.errors.body) || undefined}
          aria-describedby={state.errors.body ? "guestbook-body-error" : undefined}
        />
        {state.errors.body ? (
          <p id="guestbook-body-error" className="text-xs text-destructive">
            {state.errors.body}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? <LoaderCircleIcon className="animate-spin" /> : <SendIcon />}
          {isPending ? "저장 중…" : "남기기"}
        </Button>

        {state.attempts > 0 ? (
          <Badge variant="outline">prevState.attempts = {state.attempts}</Badge>
        ) : null}
      </div>

      {/* aria-live로 스크린 리더에도 결과가 전달되게 합니다. */}
      <p
        aria-live="polite"
        className={
          state.status === "error"
            ? "text-sm text-destructive"
            : "text-sm text-muted-foreground"
        }
      >
        {state.message}
      </p>
    </form>
  )
}
