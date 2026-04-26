import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import OrderService from "../../service/order.service.ts";
import { Order, type Pizza } from "../../service/Order.ts";

const orderSchema = z.object({
  countryCode: z.enum(["PL", "LT"]),
  pizzas: z.array(
    z.object({
      name: z.string(),
      size: z.enum(["SMALL", "LARGE"]),
      quantity: z.number().positive(),
    }),
  ),
  address: z.string(),
});

type OrderServiceLike = {
  placeOrder(order: Order): Promise<{ id: string; price: number }>;
};

export type OrdersRouteOptions = {
  orderServiceFactory?: () => OrderServiceLike;
};

const orders: FastifyPluginAsync<OrdersRouteOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  const orderServiceFactory =
    opts.orderServiceFactory ?? (() => new OrderService());

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        summary: "Place a new pizza order",
        description: "Places a new order with multiple pizzas for a specific country and address",
        body: orderSchema,
      },
    },
    async function (request, reply) {
      const { countryCode, pizzas, address } = request.body;
      return orderServiceFactory().placeOrder(
        new Order(countryCode, pizzas as Pizza[], address, undefined),
      );
    },
  );
};

export default orders;
