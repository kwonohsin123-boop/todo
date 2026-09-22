import { mkdirSync } from "node:fs"
import path from "node:path"

import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"

import * as schema from "./schema"

// 저장소 루트 기준 data/todo.db 한 파일이 DB 전체입니다 (PRD §7.3).
const DB_DIR = path.join(process.cwd(), "data")
const DB_FILE = path.join(DB_DIR, "todo.db")

function createDb() {
  mkdirSync(DB_DIR, { recursive: true })
  const sqlite = new Database(DB_FILE)
  // WAL: 읽기와 쓰기가 서로를 막지 않습니다. .db-wal / .db-shm 파일이 함께 생깁니다.
  sqlite.pragma("journal_mode = WAL")
  sqlite.pragma("foreign_keys = ON")
  return drizzle(sqlite, { schema })
}

type Db = ReturnType<typeof createDb>

// next dev의 HMR이 이 모듈을 다시 평가할 때마다 새 연결이 열리면
// 파일 락과 SQLITE_BUSY가 납니다. 개발 중에만 globalThis에 캐시합니다 (PRD §8.4).
const globalForDb = globalThis as unknown as { __todoDb?: Db }

export const db: Db = globalForDb.__todoDb ?? createDb()

if (process.env.NODE_ENV !== "production") {
  globalForDb.__todoDb = db
}
