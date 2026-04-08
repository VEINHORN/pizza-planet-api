import { describe, expect, it } from "vitest";
import OrderService from "./order.service";
import { Order, Pizza } from "./Order";

describe("OrderService", () => {
  const orderService = new OrderService();

  const margherita: Pizza = { name: "Margherita", size: "LARGE", quantity: 1 }; // price 10
  const pepperoni: Pizza = { name: "Pepperoni", size: "LARGE", quantity: 1 }; // price 20

  it("should calculate correct price for a normal order (PL)", () => {
    // PL working hours: 08:00 - 17:00
    // PL peak hours: 12:00 - 14:00
    // PL large order threshold: 100
    const order = new Order("PL", [margherita], "Warsaw", "10:00");
    const result = orderService.placeOrder(order);

    expect(result.id).toBeDefined();
    expect(result.price).toBe(10);
  });

  it("should apply peak hours discount (PL)", () => {
    // PL peak hours: 12:00 - 14:00, discount: 0.1
    const order = new Order("PL", [margherita], "Warsaw", "13:00");
    const result = orderService.placeOrder(order);

    expect(result.price).toBe(9); // 10 - (10 * 0.1)
  });

  it("should apply large order discount (PL)", () => {
    // PL large order threshold: 100, discount: 0.15
    const largeOrder: Pizza[] = Array(11).fill(margherita); // 11 * 10 = 110
    const order = new Order("PL", largeOrder, "Warsaw", "10:00");
    const result = orderService.placeOrder(order);

    expect(result.price).toBe(93.5); // 110 - (110 * 0.15)
  });

  it("should throw error when order is placed during off-hours", () => {
    // LT working hours: 09:00 - 18:00
    const order = new Order("LT", [margherita], "Vilnius", "07:00");

    expect(() => orderService.placeOrder(order)).toThrow("Order cannot be submitted out of the working hours");
  });
  it("should calculate correct price for a normal order (LT)", () => {
    // LT working hours: 09:00 - 18:00
    // LT peak hours: 13:00 - 15:00
    // LT large order threshold: 80
    const order = new Order("LT", [pepperoni], "Vilnius", "10:00");
    const result = orderService.placeOrder(order);

    expect(result.price).toBe(20);
  });

  it("should choose the best discount when multiple apply (PL)", () => {
    // PL peak hours: 12:00 - 14:00, discount: 0.1 (10%)
    // PL large order threshold: 100, discount: 0.15 (15%)
    const largeOrder: Pizza[] = Array(11).fill(margherita); // 11 * 10 = 110
    const order = new Order("PL", largeOrder, "Warsaw", "13:00");
    const result = orderService.placeOrder(order);

    // Large order discount is better (15% vs 10%)
    expect(result.price).toBe(93.5); // 110 - (110 * 0.15)
  });
});
