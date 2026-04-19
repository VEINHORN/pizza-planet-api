import {
  expect,
  describe,
  beforeAll,
  beforeEach,
  it,
  afterAll,
  afterEach,
  vi,
} from "vitest";
import { fastify, FastifyInstance } from "fastify";
import stock from "./stock";
import zodPlugin from "../../plugins/zod";

vi.mock("../../repository/shipment.repository", () => {
  const ShipmentRepository = vi.fn();
  ShipmentRepository.prototype.createShipment = vi.fn().mockImplementation((shipment) => {
    shipment.id = "mocked-id";
    return Promise.resolve(shipment);
  });
  return { ShipmentRepository };
});

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

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-04-19T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
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
