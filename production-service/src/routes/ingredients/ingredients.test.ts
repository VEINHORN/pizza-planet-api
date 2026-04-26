import { expect, describe, beforeAll, it, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { createApp } from "../../app.ts";

describe("ingredients route", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /ingredients/:ingredientId should return availability", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/ingredients/tomato-sauce",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body).toEqual({
      amount: 100,
      unit: "kg",
    });
  });
});
