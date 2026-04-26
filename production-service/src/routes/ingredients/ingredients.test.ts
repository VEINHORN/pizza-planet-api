import { expect, describe, beforeAll, it, afterAll } from "vitest";
import { fastify, FastifyInstance } from "fastify";
import ingredients from "./ingredients";
import zodPlugin from "../../plugins/zod";

describe("ingredients route", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify();
    void app.register(zodPlugin);
    void app.register(ingredients, { prefix: "/ingredients" });
    await app.ready();
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
