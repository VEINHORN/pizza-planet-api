import { uuid } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const ordersTable = pgTable("orders", {
  id: uuid().primaryKey().defaultRandom(),
  country_code: text().notNull(),
  address: text().notNull(),
  final_price: integer().notNull(),
  created_at: timestamp().defaultNow(),
});

export const orderItemTable = pgTable("order_item", {
  id: uuid().primaryKey().defaultRandom(),
  name: text(),
  size: text().notNull(),
  quantity: integer(),
  order_id: uuid()
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),
});
