import { pgSchema } from "drizzle-orm/pg-core";
import { uuid, timestamp, text, integer } from "drizzle-orm/pg-core";

export const productionSchema = pgSchema("production_service");

export const shipmentsTable = productionSchema.table("shipments", {
  id: uuid().primaryKey().defaultRandom(),
  target_warehouse: text().notNull(),
  submitted_at: text().notNull(),
  created_at: timestamp().defaultNow(),
});

export const shipmentIngredientsTable = productionSchema.table(
  "shipment_ingredients",
  {
    id: uuid().primaryKey().defaultRandom(),
    ingredient_id: text().notNull(),
    units: integer().notNull(),
    shipment_id: uuid()
      .notNull()
      .references(() => shipmentsTable.id, { onDelete: "cascade" }),
  },
);
