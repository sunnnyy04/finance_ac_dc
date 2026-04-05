import { pgTable, serial, text, numeric, timestamp, varchar, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { enum: ["VIEWER", "ANALYST", "ADMIN"] }).notNull().default("VIEWER"),
  status: varchar("status", { enum: ["ACTIVE", "INACTIVE"] }).notNull().default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const records = pgTable("records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  type: varchar("type", { enum: ["INCOME", "EXPENSE"] }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
