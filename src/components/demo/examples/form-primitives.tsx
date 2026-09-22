"use client"

import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

/** Select의 items는 값 → 표시 라벨 매핑입니다. 이게 있어야 트리거에 라벨이 보입니다. */
const bundlers: Record<string, string> = {
  turbopack: "Turbopack (기본)",
  webpack: "webpack",
  vite: "Vite",
  rspack: "Rspack",
}

/** 라벨은 순수 label 엘리먼트라 htmlFor를 직접 연결해야 합니다. 감싸기만 하면 연결되지 않습니다. */
function Row({ label, htmlFor, hint, children }: {
  label: string
  htmlFor?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function FormPrimitives() {
  const [checked, setChecked] = React.useState(true)
  const [indeterminate, setIndeterminate] = React.useState(true)
  const [notify, setNotify] = React.useState(true)
  const [runtime, setRuntime] = React.useState("nodejs")
  const [bundler, setBundler] = React.useState("turbopack")

  return (
    /*
      갤러리라 제출할 곳은 없지만 form으로 감쌉니다.
      type="password" 입력이 form 밖에 있으면 브라우저가 비밀번호 관리자를 붙이지 못하고
      Chrome이 "Password field is not contained in a form" 힌트를 콘솔에 남깁니다.
      Enter로 실제 제출이 일어나면 안 되므로 onSubmit에서 막습니다.
    */
    <form className="grid gap-8 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
      <div className="space-y-5">
        <Row label="텍스트" htmlFor="fp-text">
          <Input id="fp-text" placeholder="아무 값이나 입력해 보세요" />
        </Row>

        <Row label="이메일" htmlFor="fp-email">
          <Input id="fp-email" type="email" placeholder="you@example.com" />
        </Row>

        {/*
          autoComplete을 생략하면 Chrome이 "Input elements should have autocomplete
          attributes" 힌트를 남깁니다. 실제 로그인 폼이 아니라 갤러리이므로 비밀번호
          관리자가 값을 채우지 않도록 off를 줍니다.
          진짜 폼이라면 current-password / new-password를 쓰세요.
        */}
        <Row label="비밀번호" htmlFor="fp-password">
          <Input
            id="fp-password"
            type="password"
            placeholder="••••••••"
            autoComplete="off"
          />
        </Row>

        <Row label="숫자" htmlFor="fp-number">
          <Input id="fp-number" type="number" defaultValue={16} min={0} max={99} />
        </Row>

        <Row label="파일" htmlFor="fp-file">
          <Input id="fp-file" type="file" />
        </Row>

        <Row
          label="유효하지 않은 입력"
          htmlFor="fp-invalid"
          hint="aria-invalid에 문자열 true가 들어가야 aria-invalid: 변형이 걸립니다. false를 넘기면 속성이 렌더되어도 변형은 적용되지 않습니다."
        >
          <Input id="fp-invalid" aria-invalid defaultValue="잘못된 값" />
        </Row>

        <Row label="비활성" htmlFor="fp-disabled">
          <Input id="fp-disabled" disabled defaultValue="수정할 수 없습니다" />
        </Row>

        <Row
          label="여러 줄"
          htmlFor="fp-textarea"
          hint="field-sizing-content가 걸려 있어 내용에 따라 높이가 늘어납니다."
        >
          <Textarea id="fp-textarea" placeholder="줄을 늘려 보세요" />
        </Row>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium">체크박스</p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Checkbox
                id="fp-cb-1"
                checked={checked}
                onCheckedChange={(value) => setChecked(value)}
              />
              <Label htmlFor="fp-cb-1">제어 컴포넌트 ({checked ? "체크" : "해제"})</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="fp-cb-2"
                indeterminate={indeterminate}
                onCheckedChange={() => setIndeterminate(false)}
              />
              <Label htmlFor="fp-cb-2">
                indeterminate — 3상태 ({indeterminate ? "중간" : "해제됨"})
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="fp-cb-3" defaultChecked disabled />
              <Label htmlFor="fp-cb-3">비활성 + 체크</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="fp-cb-4" aria-invalid />
              <Label htmlFor="fp-cb-4">aria-invalid</Label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Space 키로 토글됩니다. 체크 상태는 data-checked / data-unchecked 속성으로 노출됩니다.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">스위치</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="fp-switch"
                checked={notify}
                onCheckedChange={(value) => setNotify(value)}
              />
              <Label htmlFor="fp-switch">알림 {notify ? "켜짐" : "꺼짐"}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="fp-switch-sm" size="sm" defaultChecked />
              <Label htmlFor="fp-switch-sm">size=&quot;sm&quot;</Label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="fp-switch-disabled" disabled />
            <Label htmlFor="fp-switch-disabled">비활성</Label>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">라디오 그룹</p>
          <RadioGroup value={runtime} onValueChange={(value) => setRuntime(String(value))}>
            {[
              { value: "nodejs", label: "Node.js 런타임" },
              { value: "edge", label: "Edge 런타임" },
              { value: "proxy", label: "proxy.ts (Node.js 고정)" },
            ].map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem id={`fp-radio-${option.value}`} value={option.value} />
                <Label htmlFor={`fp-radio-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          <p className="text-xs text-muted-foreground">
            선택: {runtime}. 그룹 안에서는 방향키로 이동하고, Tab은 그룹 단위로 건너뜁니다.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">셀렉트</p>
          <Select
            items={bundlers}
            value={bundler}
            onValueChange={(value) => setBundler(String(value))}
          >
            <SelectTrigger className="w-64" aria-label="번들러 선택">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Next.js 16 기본</SelectLabel>
                <SelectItem value="turbopack">{bundlers.turbopack}</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>그 외</SelectLabel>
                <SelectItem value="webpack">{bundlers.webpack}</SelectItem>
                <SelectItem value="vite">{bundlers.vite}</SelectItem>
                <SelectItem value="rspack">{bundlers.rspack}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            선택된 항목에만 data-selected=&quot;true&quot;가 붙습니다. 나머지 여덟 개 변형과 달리
            값까지 true로 맞아야 매칭되는 유일한 변형입니다. 열린 뒤 글자를 입력하면 타입어헤드로
            이동합니다.
          </p>
        </div>
      </div>
    </form>
  )
}
