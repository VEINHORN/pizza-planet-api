import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Shipment, type Ingredient } from "../service/Shipment.ts";
import { shipmentsTable, shipmentIngredientsTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export class ShipmentRepository {
  private readonly db: NodePgDatabase;

  constructor(db: NodePgDatabase) {
    this.db = db;
  }

  async createShipment(shipment: Shipment): Promise<Shipment> {
    return await this.db.transaction(async (tx) => {
      const result = await tx
        .insert(shipmentsTable)
        .values({
          target_warehouse: shipment.targetWarehouse,
        })
        .returning();

      const savedShipmentRow = result[0];

      if (shipment.ingredients && shipment.ingredients.length > 0) {
        await tx.insert(shipmentIngredientsTable).values(
          shipment.ingredients.map((i) => ({
            ingredient_id: i.id,
            units: i.units,
            shipment_id: savedShipmentRow.id,
          })),
        );
      }

      return new Shipment(
        savedShipmentRow.target_warehouse,
        shipment.ingredients,
        shipment.submittedAt(),
        savedShipmentRow.id,
      );
    });
  }

  async getShipmentById(shipmentId: string): Promise<Shipment | null> {
    const rows = await this.db
      .select({
        shipment: shipmentsTable,
        ingredient: shipmentIngredientsTable,
      })
      .from(shipmentsTable)
      .where(eq(shipmentsTable.id, shipmentId))
      .leftJoin(
        shipmentIngredientsTable,
        eq(shipmentsTable.id, shipmentIngredientsTable.shipment_id),
      );

    if (rows.length === 0) return null;

    const shipmentRow = rows[0].shipment;
    const ingredients: Ingredient[] = rows
      .filter((r) => r.ingredient !== null)
      .map((r) => ({
        id: r.ingredient!.ingredient_id,
        units: r.ingredient!.units,
      }));

    return new Shipment(
      shipmentRow.target_warehouse,
      ingredients,
      undefined,
      shipmentRow.id,
    );
  }

  async getAllShipments(): Promise<Shipment[]> {
    const rows = await this.db
      .select({
        shipment: shipmentsTable,
        ingredient: shipmentIngredientsTable,
      })
      .from(shipmentsTable)
      .leftJoin(
        shipmentIngredientsTable,
        eq(shipmentsTable.id, shipmentIngredientsTable.shipment_id),
      );

    const shipmentsMap = new Map<
      string,
      { shipmentRow: any; ingredients: Ingredient[] }
    >();

    for (const row of rows) {
      const shipmentId = row.shipment.id;
      if (!shipmentsMap.has(shipmentId)) {
        shipmentsMap.set(shipmentId, { shipmentRow: row.shipment, ingredients: [] });
      }
      if (row.ingredient) {
        shipmentsMap.get(shipmentId)!.ingredients.push({
          id: row.ingredient.ingredient_id,
          units: row.ingredient.units,
        });
      }
    }

    return Array.from(shipmentsMap.values()).map(
      ({ shipmentRow, ingredients }) =>
        new Shipment(
          shipmentRow.target_warehouse,
          ingredients,
          undefined,
          shipmentRow.id,
        ),
    );
  }

  async deleteShipment(shipmentId: string): Promise<void> {
    await this.db.delete(shipmentsTable).where(eq(shipmentsTable.id, shipmentId));
  }
}
