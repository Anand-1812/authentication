import { uuid, text, pgTable, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const userRole = pgEnum('user_role', ['USER', 'ADMIN']);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  role: userRole().notNull().default('USER'),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  salt: text("salt").notNull(),
});

export const usersSessions = pgTable("user_session", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid().references(() => usersTable.id).notNull(),
  createdAt: timestamp().defaultNow().notNull()
})

