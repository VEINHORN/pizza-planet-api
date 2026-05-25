import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createApp } from "../../app.ts";

describe("pizzas-made route", () => {
  let app: FastifyInstance;
  let handlePizzasMadeMock: ReturnType<typeof vi.fn>;

  beforeAll(async () => {
    handlePizzasMadeMock = vi.fn();
    app = await createApp({
      orderServiceFactory: () => ({
        placeOrder: vi.fn(),
        handlePizzasMade: handlePizzasMadeMock,
      }),
    } as any);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 200 and call handlePizzasMade", async () => {
    handlePizzasMadeMock.mockResolvedValue(undefined);

    const reqPayload = {
      pizzas: [
        {
          type: "Margherita",
          amount: 5,
        },
      ],
    };

    const res = await app.inject({
      method: "POST",
      url: "/pizzas-made",
      payload: reqPayload,
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.status).toBe("OK");
    expect(handlePizzasMadeMock).toHaveBeenCalledWith(reqPayload.pizzas);
  });

  it("should return 400 when payload is invalid", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/pizzas-made",
      payload: {
        invalid: "data",
      },
    });

    expect(res.statusCode).toBe(400);
  });
});
