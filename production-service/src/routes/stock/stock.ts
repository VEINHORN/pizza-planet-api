
import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { shipmentSchema } from "../../schemas/stock.schema.ts";
import ShipmentService from "../../service/shipment.service.ts";
import { Shipment } from "../../service/Shipment.ts";


const stock: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/shipments",
    {
      schema: {
        summary: "Receive ingridient shipment",
        description: "Add new ingridients to stock from a supplier shipment",
        body: shipmentSchema,
      },
    },
    async function (request, reply) {
      const { targetWarehouse, ingredients } = request.body;

      return new ShipmentService().registerShipment(
        new Shipment(targetWarehouse, ingredients),
      );
    },
  );
};

export default stock;
