"use server"

import { revalidatePath } from "next/cache"

import {
  addGuestbookEntry,
  type GuestbookFormState,
} from "@/lib/examples/guestbook"
import { sleep } from "@/lib/examples/timing"

/**
 * 파일 최상단의 'use server' 때문에 이 파일의 모든 export는 Server Function이 되고,
 * 전부 async여야 합니다. 그래서 GuestbookFormState 타입과 initialGuestbookState 상수는
 * 이 파일이 아니라 src/lib/examples/guestbook.ts 에 두었습니다.
 *
 * useActionState가 호출하는 액션의 시그니처는 (prevState, formData) 입니다.
 *
 * 보안: Server Function은 UI를 거치지 않은 직접 POST로도 도달할 수 있습니다.
 * 실제 프로젝트에서는 함수 안에서 인증과 인가를 반드시 검증하세요.
 */
export async function submitGuestbook(
  prevState: GuestbookFormState,
  formData: FormData
): Promise<GuestbookFormState> {
  const attempts = prevState.attempts + 1
  const name = String(formData.get("name") ?? "").trim()
  const body = String(formData.get("body") ?? "").trim()

  // pending 상태가 눈에 보이도록 일부러 지연시킵니다.
  await sleep(700)

  const errors: GuestbookFormState["errors"] = {}
  if (name.length < 2) errors.name = "이름은 2자 이상이어야 합니다."
  if (body.length < 5) errors.body = "내용은 5자 이상이어야 합니다."
  else if (body.length > 200) errors.body = "내용은 200자를 넘을 수 없습니다."

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "서버 검증에 실패했습니다. 클라이언트 검증만으로는 막을 수 없는 지점입니다.",
      errors,
      values: { name, body },
      attempts,
    }
  }

  addGuestbookEntry({ name, body })

  // 이 경로의 서버 컴포넌트를 다시 렌더합니다.
  // 프로덕션 빌드에서는 화면의 "서버 렌더 시각"이 이 호출로만 갱신됩니다.
  revalidatePath("/examples/server-actions")

  return {
    status: "success",
    message: "저장되었습니다. 아래 목록과 서버 렌더 시각을 확인해 보세요.",
    errors: {},
    values: { name: "", body: "" },
    attempts,
  }
}
