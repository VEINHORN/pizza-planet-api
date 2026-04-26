import { describe, expect, it, vi } from "vitest";
import OrderService from "./order.service.ts";
import { Order, type Pizza } from "./Order.ts";
import { ProductionServiceClient } from "./ProductionServiceClient.ts";
import { OrderRepository } from "../repository/order.repository.ts";

describe("OrderService", () => {
  const mockProductionClient = {
    checkIngredientAvailability: vi
      .fn()
      .mockResolvedValue({ amount: 100, unit: "kg" }),
  } as unknown as ProductionServiceClient;

  const mockOrderRepository = {
    save: vi.fn().mockImplementation((order: Order) => {
      return Promise.resolve({
        ...order,
        id: "test-id",
        finalPrice: Math.round(order.finalPrice ?? 0),
      });
    }),
  } as unknown as OrderRepository;

  const orderService = new OrderService(mockProductionClient, mockOrderRepository);

  const margherita: Pizza = { name: "Margherita", size: "LARGE", quantity: 1 }; // price 10
  const pepperoni: Pizza = { name: "Pepperoni", size: "LARGE", quantity: 1 }; // price 20

  it("should calculate correct price for a normal order (PL)", async () => {
    // PL working hours: 00:00 - 23:59
    // PL peak hours: 12:00 - 14:00
    // PL large order threshold: 100
    const order = new Order("PL", [margherita], "Warsaw", undefined, "10:00");
    const result = await orderService.placeOrder(order);

    expect(result.id).toBeDefined();
    expect(result.price).toBe(10);
  });

  it("should apply peak hours discount (PL)", async () => {
    // PL peak hours: 12:00 - 14:00, discount: 0.1
    const order = new Order("PL", [margherita], "Warsaw", undefined, "13:00");
    const result = await orderService.placeOrder(order);

    expect(result.price).toBe(9); // 10 - (10 * 0.1)
  });

  it("should apply large order discount (PL)", async () => {
    // PL large order threshold: 100, discount: 0.15
    const largeOrder: Pizza[] = Array(11).fill(margherita); // 11 * 10 = 110
    const order = new Order("PL", largeOrder, "Warsaw", undefined, "10:00");
    const result = await orderService.placeOrder(order);

    expect(result.price).toBe(94); // Math.round(110 - (110 * 0.15)) = Math.round(93.5) = 94
  });

  it("should throw error when order is placed during off-hours", async () => {
    // LT working hours: 09:00 - 18:00
    const order = new Order("LT", [margherita], "Vilnius", undefined, "07:00");

    await expect(() => orderService.placeOrder(order)).rejects.toThrow("Order cannot be submitted out of the working hours");
  });

  it("should calculate correct price for a normal order (LT)", async () => {
    // LT working hours: 09:00 - 18:00
    // LT peak hours: 13:00 - 15:00
    // LT large order threshold: 80
    const order = new Order("LT", [pepperoni], "Vilnius", undefined, "10:00");
    const result = await orderService.placeOrder(order);

    expect(result.price).toBe(20);
  });

  it("should choose the best discount when multiple apply (PL)", async () => {
    // PL peak hours: 12:00 - 14:00, discount: 0.1 (10%)
    // PL large order threshold: 100, discount: 0.15 (15%)
    const largeOrder: Pizza[] = Array(11).fill(margherita); // 11 * 10 = 110
    const order = new Order("PL", largeOrder, "Warsaw", undefined, "13:00");
    const result = await orderService.placeOrder(order);

    // Large order discount is better (15% vs 10%)
    expect(result.price).toBe(94); // Math.round(110 - (110 * 0.15)) = 94
  });
});
