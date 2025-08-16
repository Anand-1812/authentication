import { uuid, text, pgTable, varchar } from "drizzle-orm/pg-core";

const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  salt: text("salt").notNull(),
});

export default usersTable;

