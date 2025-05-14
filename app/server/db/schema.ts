import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  hashedPassword: text("hashedPassword"),
  passwordSalt: text("passwordSalt"),
  joinedAt: integer("joinedAt", { mode: "timestamp_ms" }),
})


