import { defineConfig } from "drizzle-kit"

// casing은 두지 않습니다 — schema.ts가 SQL 컬럼명을 전부 명시합니다.
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "./data/todo.db",
  },
  strict: true,
  verbose: true,
})
