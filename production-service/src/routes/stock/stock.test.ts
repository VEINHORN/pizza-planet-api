import { expect, describe, beforeAll, it, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { createApp } from "../../app.ts";

describe("stock route", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /stock/shipments with valid data", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/stock/shipments",
      payload: {
        supplier: "Pizza Supplies Inc",
        receivedAt: new Date().toISOString(),
        lotNumber: "LOT-123",
        items: [
          {
            ingredientName: "Tomato Sauce",
            quantity: 10,
            unit: "kg",
            expiryDate: "2026-12-31",
            unitPrice: 50.5,
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
        items: [],
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
