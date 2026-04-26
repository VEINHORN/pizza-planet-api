import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const ingredients: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/:ingredientId",
    {
      schema: {
        summary: "Get ingredient availability",
        description:
          "Returns the current availability of a specific ingredient",
        params: z.object({
          ingredientId: z.string(),
        }),
        response: {
          200: z.object({
            amount: z.number(),
            unit: z.string(),
          }),
        },
      },
    },
    async function (request, reply) {
      const { ingredientId } = request.params;

      console.log("Ingredient id: " + ingredientId);

      return {
        amount: 100,
        unit: "kg",
      };
    },
  );
};

export default ingredients;
