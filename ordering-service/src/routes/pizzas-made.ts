import type { FastifyPluginAsync } from "fastify";
import OrderService from "../service/order.service.ts";
import { buildFastifyPayloadRoute } from "@lokalise/fastify-api-contracts";
import { notifyPizzasMade } from "@pizza-planet/api-contracts";

export type PizzasMadeRouteOptions = {
  orderServiceFactory?: () => {
    handlePizzasMade(pizzas: { type: string; amount: number }[]): Promise<void>;
  };
};

const pizzasMade: FastifyPluginAsync<PizzasMadeRouteOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  const orderServiceFactory =
    opts.orderServiceFactory ?? (() => new OrderService());

  fastify.route(
    buildFastifyPayloadRoute(notifyPizzasMade as any, async (request: any, reply) => {
      const { pizzas } = request.body;
      await orderServiceFactory().handlePizzasMade(pizzas);
      reply.send({
        status: "OK",
      });
    }) as any,
  );
};

export default pizzasMade;
