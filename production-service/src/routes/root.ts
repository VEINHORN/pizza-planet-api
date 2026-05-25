import type { FastifyPluginAsync } from "fastify";
import { buildFastifyRoute } from "@lokalise/fastify-api-contracts";
import { getIngredientAvailability } from "@pizza-planet/api-contracts";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return { root: true };
  });

  fastify.route(
    buildFastifyRoute(getIngredientAvailability as any, async (request: any, reply) => {
      const { ingredientId } = request.params;

      console.log("Ingredient id: " + ingredientId);

      reply.send({
        amount: 100,
        unit: "kg",
      });
    }),
  );
};

export default root;
