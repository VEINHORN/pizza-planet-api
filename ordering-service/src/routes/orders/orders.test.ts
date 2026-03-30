import fastify, { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
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

  it("should return 200 response status and the same body as in the request", async () => {
    const reqPayload = {
      orderId: "123",
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
      userId: 10,
      address: "Vilnius",
    };

    const res = await app.inject({
      method: "POST",
      url: "/orders",
      payload: reqPayload,
    });

    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe(JSON.stringify(reqPayload));
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
