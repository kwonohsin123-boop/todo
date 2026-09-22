export type GuestbookEntry = {
  id: string
  name: string
  body: string
  createdAt: string
}

/** Server Action이 useActionState로 주고받는 상태입니다. */
export type GuestbookFormState = {
  status: "idle" | "success" | "error"
  message: string
  errors: { name?: string; body?: string }
  values: { name: string; body: string }
  /** 제출 횟수. prevState가 실제로 전달되는지 화면에서 확인하기 위한 값입니다. */
  attempts: number
}

export const initialGuestbookState: GuestbookFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: { name: "", body: "" },
  attempts: 0,
}

/**
 * 인메모리 저장소입니다. 서버 재시작과 HMR에 초기화되고 여러 인스턴스 간에 공유되지 않습니다.
 * 실제 프로젝트에서는 이 배열을 DB 호출로 바꾸세요.
 */
const entries: GuestbookEntry[] = [
  {
    id: "seed-2",
    name: "이서연",
    body: "revalidatePath가 서버 렌더 시각을 갱신하는지 확인하는 중입니다.",
    createdAt: "2026-03-21T02:14:00.000Z",
  },
  {
    id: "seed-1",
    name: "박도윤",
    body: "useActionState의 pending 상태가 버튼에 잘 반영되네요.",
    createdAt: "2026-03-20T08:40:00.000Z",
  },
]

export function listGuestbookEntries(): GuestbookEntry[] {
  return [...entries]
}

export function addGuestbookEntry(input: { name: string; body: string }): GuestbookEntry {
  const entry: GuestbookEntry = {
    id: `${Date.now()}-${entries.length}`,
    name: input.name,
    body: input.body,
    createdAt: new Date().toISOString(),
  }
  entries.unshift(entry)
  return entry
}
