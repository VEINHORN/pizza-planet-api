import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ingridientShipmentSchema } from "../../schemas/stock.schema";

const stock: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/shipments",
    {
      schema: {
        summary: "Receive ingridient shipment",
        description: "Add new ingridients to stock from a supplier shipment",
        body: ingridientShipmentSchema,
      },
    },
    async function (request, reply) {
      return request.body;
    },
  );
};

export default stock;
