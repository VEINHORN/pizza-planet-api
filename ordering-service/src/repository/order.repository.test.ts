import { describe, expect, it, vi, beforeEach } from "vitest";
import { OrderRepository } from "./order.repository.ts";
import { Order, type Pizza } from "../service/Order.ts";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

describe("OrderRepository", () => {
  let mockDb: any;
  let repository: OrderRepository;

  beforeEach(() => {
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
    repository = new OrderRepository(mockDb as unknown as NodePgDatabase<any>);
  });

  it("should save an order and its pizzas", async () => {
    const pizzas: Pizza[] = [
      { name: "Margherita", size: "LARGE", quantity: 2 },
    ];
    const order = new Order("PL", pizzas, "Warsaw", 20);
    const orderId = "test-uuid";
    const createdAt = new Date();

    mockDb.returning.mockResolvedValueOnce([
      {
        id: orderId,
        country_code: "PL",
        address: "Warsaw",
        final_price: 20,
        created_at: createdAt,
      },
    ]);

    const result = await repository.save(order);

    expect(mockDb.insert).toHaveBeenCalledTimes(2); // One for order, one for items
    expect(result.id).toBe(orderId);
    expect(result.finalPrice).toBe(20);
    expect(result.pizzas).toEqual(pizzas);
  });

  it("should get an order by id", async () => {
    const orderId = "test-uuid";
    const createdAt = new Date();

    mockDb.leftJoin.mockResolvedValueOnce([
      {
        order: {
          id: orderId,
          country_code: "PL",
          address: "Warsaw",
          final_price: 20,
          created_at: createdAt,
        },
        item: { name: "Margherita", size: "LARGE", quantity: 2 },
      },
    ]);

    const result = await repository.getOrderById(orderId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(orderId);
    expect(result?.pizzas.length).toBe(1);
    expect(result?.pizzas[0].name).toBe("Margherita");
  });

  it("should return null if order not found", async () => {
    mockDb.leftJoin.mockResolvedValueOnce([]);
    const result = await repository.getOrderById("non-existent");
    expect(result).toBeNull();
  });

  it("should get all orders", async () => {
    const orderId1 = "uuid-1";
    const orderId2 = "uuid-2";
    const createdAt = new Date();

    mockDb.leftJoin.mockResolvedValueOnce([
      {
        order: {
          id: orderId1,
          country_code: "PL",
          address: "Warsaw",
          final_price: 20,
          created_at: createdAt,
        },
        item: { name: "Margherita", size: "LARGE", quantity: 1 },
      },
      {
        order: {
          id: orderId2,
          country_code: "LT",
          address: "Vilnius",
          final_price: 15,
          created_at: createdAt,
        },
        item: { name: "Pepperoni", size: "SMALL", quantity: 1 },
      },
    ]);

    const result = await repository.getAllOrders();

    expect(result.length).toBe(2);
    expect(result[0].id).toBe(orderId1);
    expect(result[1].id).toBe(orderId2);
  });

  it("should delete an order", async () => {
    const orderId = "test-uuid";
    await repository.deleteOrder(orderId);
    expect(mockDb.delete).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });
});
