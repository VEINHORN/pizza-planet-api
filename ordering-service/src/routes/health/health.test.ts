import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fastify, { FastifyInstance } from "fastify";
import health from "./health";

describe("health route", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify();
    void app.register(health, { prefix: "/health" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 200 response status and OK body", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/health",
    });

    expect(res.statusCode).toBe(200);
    expect(res.payload).toBe("OK");
  });
});
