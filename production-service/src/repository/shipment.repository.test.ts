import { beforeEach, describe, expect, it, vi } from "vitest";
import { Shipment, type Ingredient } from "../service/Shipment.ts";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

vi.mock("../db/schema.ts", () => ({
  shipmentsTable: { id: "shipment-id-column" },
  shipmentIngredientsTable: {
    shipment_id: "shipment-ingredient-shipment-id-column",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((left, right) => ({ left, right })),
}));

describe("ShipmentRepository", () => {
  let mockDb: any;
  let repository: InstanceType<
    Awaited<typeof import("./shipment.repository.ts")>["ShipmentRepository"]
  >;

  beforeEach(async () => {
    const { ShipmentRepository } = await import("./shipment.repository.ts");

    mockDb = {
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      transaction: vi.fn((callback) => callback(mockDb)),
    };
    repository = new ShipmentRepository(
      mockDb as unknown as NodePgDatabase<any>,
    );
  });

  it("should create a shipment and its ingredients", async () => {
    const ingredients: Ingredient[] = [
      { id: "cheese", units: 100 },
      { id: "tomato", units: 50 },
    ];
    const shipment = new Shipment("warehouse1", ingredients, "12:00");
    const shipmentId = "shipment-uuid";

    mockDb.returning.mockResolvedValueOnce([
      {
        id: shipmentId,
        target_warehouse: "warehouse1",
        created_at: new Date(),
      },
    ]);

    const result = await repository.createShipment(shipment);

    expect(mockDb.insert).toHaveBeenCalledTimes(2); // One for shipment, one for ingredients
    expect(result.id).toBe(shipmentId);
    expect(result.targetWarehouse).toBe("warehouse1");
    expect(result.ingredients).toEqual(ingredients);
  });

  it("should get a shipment by id", async () => {
    const shipmentId = "shipment-uuid";

    mockDb.leftJoin.mockResolvedValueOnce([
      {
        shipment: {
          id: shipmentId,
          target_warehouse: "warehouse1",
        },
        ingredient: { ingredient_id: "cheese", units: 100 },
      },
      {
        shipment: {
          id: shipmentId,
          target_warehouse: "warehouse1",
        },
        ingredient: { ingredient_id: "tomato", units: 50 },
      },
    ]);

    const result = await repository.getShipmentById(shipmentId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(shipmentId);
    expect(result?.ingredients.length).toBe(2);
    expect(result?.ingredients[0].id).toBe("cheese");
    expect(result?.ingredients[1].id).toBe("tomato");
  });

  it("should return null if shipment not found", async () => {
    mockDb.leftJoin.mockResolvedValueOnce([]);
    const result = await repository.getShipmentById("non-existent");
    expect(result).toBeNull();
  });

  it("should get all shipments", async () => {
    const shipmentId1 = "uuid-1";
    const shipmentId2 = "uuid-2";

    mockDb.leftJoin.mockResolvedValueOnce([
      {
        shipment: {
          id: shipmentId1,
          target_warehouse: "warehouse1",
        },
        ingredient: { ingredient_id: "cheese", units: 100 },
      },
      {
        shipment: {
          id: shipmentId2,
          target_warehouse: "warehouse2",
        },
        ingredient: { ingredient_id: "tomato", units: 50 },
      },
    ]);

    const result = await repository.getAllShipments();

    expect(result.length).toBe(2);
    expect(result[0].id).toBe(shipmentId1);
    expect(result[1].id).toBe(shipmentId2);
  });

  it("should delete a shipment", async () => {
    const shipmentId = "shipment-uuid";
    await repository.deleteShipment(shipmentId);
    expect(mockDb.delete).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });
});
