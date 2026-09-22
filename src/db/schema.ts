import { sql } from "drizzle-orm"
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core"

/**
 * tasks — MVP의 유일한 테이블입니다 (PRD §8.2).
 *
 * 설계 메모
 * - 완료 여부는 별도 boolean 컬럼이 아니라 `doneAt`의 NULL 여부로 판단합니다.
 * - epoch ms 컬럼은 mode: "timestamp_ms" 입니다. PRD §8.2 본문의 "timestamp" 표기는
 *   drizzle에서 '초 단위'를 뜻하므로 그대로 쓰면 1000배 어긋납니다.
 * - 세 번째 인자는 배열을 반환하는 콜백입니다. 객체 반환형은 deprecated 입니다.
 */
export const tasks = sqliteTable(
  "tasks",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    notes: text("notes"),
    /** YYYY-MM-DD. "오늘의 MIT"를 가르는 기준 날짜입니다. */
    plannedDate: text("planned_date").notNull(),
    /** 0·1·2면 MIT, NULL이면 일반 할 일입니다. */
    mitOrder: integer("mit_order"),
    /** 타임블록 시작(자정 기준 분). NULL이면 미배치입니다. */
    startMin: integer("start_min"),
    durationMin: integer("duration_min").notNull().default(30),
    sortOrder: integer("sort_order").notNull().default(0),
    /** 완료 시각(epoch ms). NULL 여부가 곧 완료 상태입니다. */
    doneAt: integer("done_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [
    // MIT 최대 3개 제약의 DB 측 절반입니다.
    // 나머지 절반(애플리케이션 재검증)은 Server Action에서 수행합니다 — PRD §8.2.
    unique("tasks_planned_date_mit_order_unique").on(t.plannedDate, t.mitOrder),
    check("tasks_mit_order_check", sql`${t.mitOrder} IS NULL OR ${t.mitOrder} IN (0, 1, 2)`),
    index("tasks_planned_date_idx").on(t.plannedDate),
  ],
)

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert

// focus_sessions(PRD §8.3)는 Should-have(집중 모드·리포트) 착수 시점에
// 새 마이그레이션으로 추가합니다. MVP에서는 생성하지 않습니다.
