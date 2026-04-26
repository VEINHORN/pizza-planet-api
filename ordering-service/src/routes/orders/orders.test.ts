import type { FastifyInstance } from "fastify";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { createApp } from "../../app.ts";
import { OffHoursError } from "../../service/errors.ts";

describe("orders route", () => {
  let app: FastifyInstance;
  let placeOrderMock: ReturnType<typeof vi.fn>;

  beforeAll(async () => {
    placeOrderMock = vi.fn();
    app = await createApp({
      orderServiceFactory: () => ({
        placeOrder: placeOrderMock,
      }),
    } as any);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    placeOrderMock.mockReset();
  });

  it("should return 200 response status and calculated price", async () => {
    placeOrderMock.mockResolvedValue({
      id: "test-id",
      price: 40,
    });

    const reqPayload = {
      countryCode: "LT",
      pizzas: [
        {
          name: "Margherita",
          size: "LARGE",
          quantity: 2,
        },
        {
          name: "Pepperoni",
          size: "SMALL",
          quantity: 1,
        },
      ],
      address: "Vilnius",
    };

    const res = await app.inject({
      method: "POST",
      url: "/orders",
      payload: reqPayload,
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.id).toBeDefined();
    expect(body.price).toBe(40);
  });

  it("should return 400 status when order is placed during off-hours", async () => {
    placeOrderMock.mockRejectedValue(
      new OffHoursError("Order cannot be submitted out of the working hours"),
    );

    const reqPayload = {
      countryCode: "LT",
      pizzas: [
        {
          name: "Margherita",
          size: "LARGE",
          quantity: 1,
        },
      ],
      address: "Vilnius",
    };

    const res = await app.inject({
      method: "POST",
      url: "/orders",
      payload: reqPayload,
    });

    expect(res.statusCode).toBe(400);
  });

  it("should return 400 status when required field are missing", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/orders",
      payload: {
        userId: 100,
      },
    });

    expect(res.statusCode).toBe(400);
  });
});
