import fastify, { FastifyInstance } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import orders from "./orders";
import OrderService from "../../service/order.service";
import { OffHoursError } from "../../service/errors";

vi.mock("../../service/order.service");

describe("orders route", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify().withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    void app.register(orders, { prefix: "/orders" });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 200 response status and calculated price", async () => {
    const mockPlaceOrder = vi.fn().mockResolvedValue({
      id: "test-id",
      price: 40,
    });
    OrderService.prototype.placeOrder = mockPlaceOrder;

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
    const mockPlaceOrder = vi.fn().mockRejectedValue(new OffHoursError("Order cannot be submitted out of the working hours"));
    OrderService.prototype.placeOrder = mockPlaceOrder;

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
