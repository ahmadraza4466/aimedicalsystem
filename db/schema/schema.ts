import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";
import { v4 as uuidv4 } from "uuid";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().$default(uuidv4),
  email: text("email").notNull(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
  emailVerified: boolean("email_verified").default(false),
});

export const chats = mysqlTable("chats", {
  id: varchar("id", { length: 36 }).primaryKey().$default(uuidv4),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 50 }),
  createdAt: timestamp("create_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const chatMessages = mysqlTable("chat_messages", {
  id: varchar("id", { length: 36 }).primaryKey().$default(uuidv4),
  chatId: varchar("chat_id", { length: 36 })
    .notNull()
    .references(() => chats.id),
  content: text("content").notNull(),
  createdAt: timestamp("create_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});
