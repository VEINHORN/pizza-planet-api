import { expect, describe, beforeAll, it, afterAll } from "vitest";
import { fastify, FastifyInstance } from "fastify";
import stock from "./stock";
import zodPlugin from "../../plugins/zod";

describe("stock route", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify();
    void app.register(zodPlugin);
    void app.register(stock, { prefix: "/stock" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /stock/shipments with valid data", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/stock/shipments",
      payload: {
        targetWarehouse: "warehouse1",
        ingredients: [
          {
            id: "tomato-sauce",
            units: 50,
          },
        ],
      },
    });

    expect(response.statusCode).toBe(200);
  });

  it("POST /stock/shipments with invalid data", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/stock/shipments",
      payload: {
        targetWarehouse: "warehouse1",
        ingredients: [],
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
