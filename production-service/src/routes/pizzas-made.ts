import type { FastifyPluginAsync } from "fastify";
import { buildFastifyPayloadRoute } from "@lokalise/fastify-api-contracts";
import { notifyPizzasMade } from "@pizza-planet/api-contracts";
import { OrderingServiceClient } from "../service/OrderingServiceClient.ts";

const production: FastifyPluginAsync = async (fastify): Promise<void> => {
  const orderingClient = new OrderingServiceClient();

  fastify.route(
    buildFastifyPayloadRoute(notifyPizzasMade as any, async (request: any, reply) => {
      const { pizzas } = request.body;
      
      console.log(`Production Service: Reporting ${pizzas.length} pizza types made to Ordering Service`);
      
      // In a real scenario, this route might be called by a kitchen UI or sensor.
      // Here we proxy it to the Ordering Service as requested by the contract integration task.
      await orderingClient.notifyPizzasMade(pizzas);
      
      reply.send({
        status: "OK",
      });
    }) as any,
  );
};

export default production;
