import fastify, { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import orders from "./orders";

describe("orders route", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify();
    void app.register(orders, { prefix: "/orders" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 200 response status and calculated price", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-04-02T12:00:00"));

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
    expect(body.price).toBe(40); // 2 * 10 (Margherita LARGE) + 1 * 20 (Pepperoni SMALL) = 40

    vi.useRealTimers();
  });

  it("should return 400 status when order is placed during off-hours", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-04-08T07:00:00")); // Off hours for LT (9:00-18:00)

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

    expect(res.statusCode).toBe(400); // Expect 400 instead of 500
    vi.useRealTimers();
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
