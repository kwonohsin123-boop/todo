import { asc, eq } from "drizzle-orm"

import { db } from "@/db/client"
import { tasks, type Task } from "@/db/schema"

/**
 * 'use server' 파일은 모든 export가 async 함수여야 하므로
 * 타입·상수·동기 헬퍼는 여기에 둡니다.
 * (기존 src/lib/examples/guestbook.ts ↔ examples/server-actions/actions.ts 분리 관례와 동일)
 */

/** MIT 슬롯은 0·1·2 세 개뿐입니다. DB의 CHECK 제약과 같은 값입니다. */
export const MIT_SLOTS = [0, 1, 2] as const
export type MitSlot = (typeof MIT_SLOTS)[number]

/** 타임블록 기본 소요 시간(분) — PRD §8.2. */
export const DEFAULT_DURATION_MIN = 30

/** Server Action이 useActionState로 주고받는 상태입니다. 예외를 던지지 않고 항상 이 객체를 반환합니다. */
export type TaskFormState = {
  status: "idle" | "success" | "error"
  message: string
  errors: { title?: string; mitOrder?: string; startMin?: string }
  values: { title: string; notes: string }
}

export const initialTaskFormState: TaskFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: { title: "", notes: "" },
}

/**
 * planned_date에 쓰는 YYYY-MM-DD 키를 만듭니다.
 *
 * 로케일·타임존을 Asia/Seoul로 고정합니다. 고정하지 않으면 서버(UTC)와 브라우저의
 * '오늘'이 달라져 하이드레이션 불일치가 납니다 (PRD §8.4).
 * en-CA는 YYYY-MM-DD를 그대로 내주는 로케일입니다.
 *
 * 인자를 생략하면 내부에서 new Date()를 부르므로 컴포넌트 본문에서 호출하지 마세요
 * (ESLint react-hooks/purity가 error로 막습니다).
 */
export function todayKey(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
}

/** 완료 여부는 done_at의 NULL 여부로만 판단합니다. */
export function isDone(task: Task): boolean {
  return task.doneAt !== null
}

/** 특정 날짜의 MIT를 슬롯 순서로, 나머지 할 일을 sort_order 순으로 돌려줍니다. */
export function listTasksByDate(plannedDate: string): Task[] {
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.plannedDate, plannedDate))
    .orderBy(asc(tasks.mitOrder), asc(tasks.sortOrder))
    .all()
}
